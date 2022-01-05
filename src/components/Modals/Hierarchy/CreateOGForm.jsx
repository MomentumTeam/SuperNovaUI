import * as Yup from 'yup';
import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { debounce } from 'lodash';

import Hierarchy from '../../Fields/Hierarchy';
import Approver from '../../Fields/Approver';
import { isHierarchyAlreadyTakenRequest } from '../../../service/KartoffelService';
import { useStores } from '../../../context/use-stores';
import { GetDefaultApprovers } from '../../../utils/approver';
import { isUserHoldType } from '../../../utils/user';
import {
  USER_SOURCE_DI,
  USER_TYPE,
  NAME_OG_EXP,
  highCommanderRanks,
} from '../../../constants';
import { getOuDisplayName, hierarchyConverse } from '../../../utils/hierarchy';
import { isApproverValid } from '../../../service/ApproverService';

const validationSchema = Yup.object().shape({
  newHierarchy: Yup.string()
    .required('יש למלא שם היררכיה חדשה')
    .matches(NAME_OG_EXP, 'שם לא תקין')
    .test({
      name: 'valid-hierarchy-name',
      message: 'יש לבחור היררכיה פנויה',
      test: (newHierarchy, context) => {
        return (
          newHierarchy &&
          !context.parent?.isHierarchyAlreadyTakenData?.isOGNameAlreadyTaken
        );
      },
    }),
  parentHierarchy: Yup.object().required('יש לבחור היררכית אב'),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array()
    .when('isUserApprover', {
      is: false,
      then: Yup.array()
        .min(1, 'יש לבחור לפחות גורם מאשר אחד')
        .required('יש לבחור לפחות גורם מאשר אחד'),
    })
    .test({
      name: 'check-if-valid',
      message: 'יש לבחור מאשרים תקינים (מהיחידה בלבד)',
      test: async (approvers, context) => {
        console.log('approvers', approvers);
        let isTotalValid = true;

        if (
          approvers &&
          Array.isArray(approvers) &&
          context.parent?.parentHierarchy?.id
        ) {
          await Promise.all(
            approvers.map(async (approver) => {
              const { isValid } = await isApproverValid(
                approver.entityId,
                context.parent.parentHierarchy.id
              );
              if (!isValid) isTotalValid = false;
            })
          );
        }

        return isTotalValid;
      },
    }),
  comments: Yup.string().optional(),
  isHierarchyAlreadyTakenData: Yup.object()
    .shape({
      isOGNameAlreadyTaken: Yup.boolean().oneOf([false]).required(),
    })
    .required(),
});

const CreateOGForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore } = useStores();
    const [defaultApprovers, setDefaultApprovers] = useState([]);

    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);
    const isHighCommander =
      isUserApprover && userStore.user?.rank
        ? highCommanderRanks.includes(userStore.user.rank)
        : false;

    const { register, handleSubmit, setValue, formState, watch, getValues } =
      useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: { isUserApprover },
      });

    const { errors } = formState;

    useEffect(async () => {
      if (requestObject) {
        setValue('comments', requestObject.comments);
        setValue('newHierarchy', requestObject.adParams.name);
        setValue('parentHierarchy', {
          name: requestObject.kartoffelParams.hierarchy,
        });

        const result = await GetDefaultApprovers({
          request: requestObject,
          onlyForView,
          user: userStore.user,
        });
        setDefaultApprovers(result || []);
      }
    }, []);

    const onSubmit = async (data) => {
      const { newHierarchy, parentHierarchy, approvers, comments } = data;

      try {
        await validationSchema.validate(data);
      } catch (err) {
        throw new Error(err.errors);
      }

      const req = {
        commanders: approvers,
        kartoffelParams: {
          name: newHierarchy,
          parent: parentHierarchy.id,
          source: USER_SOURCE_DI,
          hierarchy: hierarchyConverse(parentHierarchy),
        },
        adParams: {
          ouDisplayName: getOuDisplayName(
            parentHierarchy.hierarchy,
            parentHierarchy.name
          ),
          ouName: parentHierarchy.name,
          name: newHierarchy,
        },
        comments,
      };

      await appliesStore.createOGApply(req);
      setIsActionDone(true);

    };

    useImperativeHandle(ref, () => ({
      handleSubmit: handleSubmit(onSubmit),
    }));

    const debouncedHierarchyName = useRef(
      debounce(async (hierarchyToSearch, directGroup) => {
        const result = await isHierarchyAlreadyTakenRequest(
          hierarchyToSearch,
          directGroup
        );
        setValue('isHierarchyAlreadyTakenData', result);
      }, 200)
    );

    const onHierarchyNameChange = async (e) => {
      const hierarchyNameToSearch = e.target.value;
      setValue('newHierarchy', e.target.value, { shouldValidate: true });

      if (hierarchyNameToSearch && getValues('parentHierarchy')?.id) {
        debouncedHierarchyName.current(
          hierarchyNameToSearch,
          getValues('parentHierarchy').id
        );
      }
    };

    const handleOrgSelected = async (org) => {
      if (isHighCommander) {
        //this apply needs highCommander approval

        const result = await GetDefaultApprovers({
          request: requestObject,
          user: userStore.user,
          onlyForView,
          groupId: org.id,
        });

        setDefaultApprovers(result || []);
        setValue('isUserApprover', result.length > 0);
      }

      if (getValues('newHierarchy')) {
        debouncedHierarchyName.current(
          getValues('newHierarchy'),
          getValues('parentHierarchy').id
        );
      }
    };

    return (
      <div className="p-fluid">
        <div className="p-fluid-item p-fluid-item-flex1">
          <Hierarchy
            setValue={setValue}
            name="parentHierarchy"
            errors={errors}
            labelText={'היררכיית אב'}
            ogValue={watch('parentHierarchy')}
            disabled={onlyForView}
            userHierarchy={
              userStore.user && userStore.user.hierarchy
                ? userStore.user.hierarchy
                : null
            }
            onOrgSelected={handleOrgSelected}
          />
        </div>
        <div className="p-fluid-item">
          <div className="p-field">
            <label htmlFor="2021">
              <span className="required-field">*</span>שם היררכיה חדשה
            </label>
            <span className="p-input-icon-left">
              {watch('parentHierarchy') && watch('newHierarchy') && (
                <i>
                  {watch('isHierarchyAlreadyTakenData')?.isOGNameAlreadyTaken
                    ? 'תפוס'
                    : 'פנוי'}
                </i>
              )}
              <InputText
                {...register('newHierarchy')}
                id="2021"
                type="text"
                required
                disabled={onlyForView}
                onChange={onHierarchyNameChange}
              />
              <label>
                {errors.newHierarchy && (
                  <small style={{ color: 'red' }}>
                    {errors.newHierarchy?.message
                      ? errors.newHierarchy.message
                      : 'יש למלא ערך'}
                  </small>
                )}
              </label>
            </span>
          </div>
        </div>
        <div className="p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            multiple={true}
            errors={errors}
            isHighRank={true}
            tooltip='סא"ל ומעלה ביחידתך'
            disabled={onlyForView || (isUserApprover && isHighCommander)}
            defaultApprovers={defaultApprovers}
          />
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label htmlFor="2023">הערות</label>
            <InputTextarea
              {...register('comments')}
              id="2023"
              type="text"
              placeholder="הכנס הערות לבקשה..."
              disabled={onlyForView}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default CreateOGForm;

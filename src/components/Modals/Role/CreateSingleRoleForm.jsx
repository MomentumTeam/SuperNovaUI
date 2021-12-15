import React, { useImperativeHandle, forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import Hierarchy from '../../Fields/Hierarchy';
import Approver from '../../Fields/Approver';
import { useStores } from '../../../context/use-stores';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { isJobTitleAlreadyTakenRequest } from '../../../service/KartoffelService';
import { isUserHoldType } from '../../../utils/user';
import { USER_SOURCE_DI, USER_TYPE, ROLE_CLEARANCE } from '../../../constants';
import { GetDefaultApprovers } from '../../../utils/approver';

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  hierarchy: Yup.object().required(),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when('isUserApprover', {
    is: false,
    then: Yup.array()
      .min(1, 'יש לבחור לפחות גורם מאשר אחד')
      .required('יש לבחור לפחות גורם מאשר אחד'),
  }),
  comments: Yup.string().optional(),
  clearance: Yup.string().required(),
  roleName: Yup.string().required(),
  isTafkidan: Yup.boolean().default(false),
  isJobAlreadyTakenData: Yup.object()
    .shape({
      isJobTitleAlreadyTaken: Yup.boolean().oneOf([false]).required(),
    })
    .required(),
});

const RenameSingleOGForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore } = useStores();
    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);

    const { register, handleSubmit, setValue, watch, formState } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover },
    });
    const { errors } = formState;

    useEffect(() => {
      if (requestObject) {
        setValue('comments', requestObject.comments);
        setValue('clearance', requestObject.kartoffelParams.clearance);
        setValue('roleName', requestObject.kartoffelParams.jobTitle);
        setValue('hierarchy', { name: requestObject.adParams.ouDisplayName });
        setValue('isTafkidan', !!requestObject.kartoffelParams.roleEntityType);
      }
    }, []);

    const onSubmit = async (data) => {
      try {
        await validationSchema.validate(data);
      } catch (err) {
        throw new Error(err.errors);
      }
      const {
        approvers,
        hierarchy,
        comments,
        clearance,
        roleName,
        isTafkidan,
      } = data;

      const req = {
        commanders: approvers,
        kartoffelParams: {
          jobTitle: roleName,
          directGroup: hierarchy.id,
          isRoleAttachable: true,
          source: USER_SOURCE_DI,
          type: 'domainUser',
          clearance,
          roleEntityType: isTafkidan ? 'goalUser' : undefined,
        },
        adParams: {
          ouDisplayName: hierarchy.name,
          jobTitle: roleName,
        },
        comments,
        due: Date.now(),
      };

      await appliesStore.createRoleApply(req);
      setIsActionDone(true);
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: handleSubmit(onSubmit),
      }),
      []
    );

    const onRoleNameChange = async (e) => {
      const roleNameToSearch = e.target.value;
      setValue('roleName', e.target.value);

      if (roleNameToSearch && watch('hierarchy')?.id) {
        const isJobTitleAlreadyTakenResponse =
          await isJobTitleAlreadyTakenRequest(
            roleNameToSearch,
            watch('hierarchy').id
          );

        setValue('isJobAlreadyTakenData', isJobTitleAlreadyTakenResponse);
      }
    };

    const onAvailableRoleName = (e) => {
      setValue('roleName', e.target.innerHTML);
      setValue('isJobAlreadyTakenData', {
        isJobTitleAlreadyTaken: false,
      });
    };

    return (
      <div className="p-fluid">
        <div className="display-flex title-wrap" style={{ width: 'inherit' }}>
          <h2>היררכיה</h2>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="hierarchy"
              errors={errors}
              ogValue={watch('hierarchy')}
              disabled={onlyForView}
            />
          </div>
        </div>
        <div className="p-fluid-item p-fluid-item">
          <div className="p-field">
            <label>
              <span className="required-field">*</span>שם תפקיד
            </label>
            <span className="p-input-icon-left">
              {watch('hierarchy') && watch('roleName') && (
                <i>
                  {watch('isJobAlreadyTakenData')?.isJobTitleAlreadyTaken
                    ? 'תפוס'
                    : 'פנוי'}
                </i>
              )}
              <InputText
                {...register('roleName')}
                onChange={onRoleNameChange}
                disabled={onlyForView}
              />
              <label>
                {errors.roleName && (
                  <small style={{ color: 'red' }}>יש למלא ערך</small>
                )}
              </label>
              <label>
                {errors.isJobAlreadyTakenData && (
                  <small>יש לבחור תפקיד פנוי</small>
                )}
              </label>
            </span>
          </div>
        </div>
        {watch('isJobAlreadyTakenData')?.isJobTitleAlreadyTaken && (
          <div
            className="p-fluid-item p-fluid-item-flex1"
            style={{ alignItems: 'baseline', whiteSpace: 'pre-wrap' }}
          >
            <div className="p-field" style={{ display: 'flex' }}>
              <div style={{ marginTop: '35px' }}>שמות פנויים:</div>
              <div
                style={{ margin: '20px', display: 'flex', flexWrap: 'wrap' }}
              >
                {watch('isJobAlreadyTakenData').suggestions.map(
                  (suggestion) => (
                    <Button
                      className="p-button-secondary p-button-outlined"
                      style={{ width: 'auto' }}
                      onClick={onAvailableRoleName}
                    >
                      {suggestion}
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        )}
        <div className="p-fluid-item p-fluid-item">
          <div className="p-field">
            <label>
              <span className="required-field">*</span>סיווג תפקיד
            </label>
            <Dropdown
              options={ROLE_CLEARANCE}
              placeholder="סיווג תפקיד"
              {...register('clearance')}
              value={watch('clearance')}
              disabled={onlyForView}
            />
            <label>
              {errors.clearance && (
                <small style={{ color: 'red' }}>יש למלא ערך</small>
              )}
            </label>
          </div>
        </div>
        <div className="p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            tooltip='רס"ן ומעלה ביחידתך'
            multiple={true}
            errors={errors}
            disabled={onlyForView || isUserApprover}
            defaultApprovers={GetDefaultApprovers(requestObject, onlyForView)}
          />
        </div>
        <div className="p-field-checkbox" style={{ marginBottom: '10px' }}>
          <Checkbox
            style={{ marginLeft: '10px' }}
            {...register('isTafkidan')}
            onChange={(e) => setValue('isTafkidan', e.checked)}
            checked={watch('isTafkidan')}
            disabled={onlyForView}
          />
          <label>התפקיד נפתח עבור משתמש תפקידן (מילואים / חמ"ל)</label>
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <label>
              <span></span>הערות
            </label>
            <InputTextarea
              {...register('comments')}
              type="text"
              autoResize="false"
              disabled={onlyForView}
              placeholder="הכנס הערות לבקשה..."
            />
            <label>התפקיד נפתח עבור משתמש תפקידן (מילואים / חמ"ל)</label>
            <label>
              {errors.comments && (
                <small style={{ color: 'red' }}>יש למלא ערך</small>
              )}
            </label>
          </div>
        </div>
      </div>
    );
  }
);

export default RenameSingleOGForm;

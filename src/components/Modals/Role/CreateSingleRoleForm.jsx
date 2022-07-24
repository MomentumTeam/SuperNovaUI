import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from 'react';
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
import { isUserApproverType } from '../../../utils/user';
import { ROLE_CLEARANCE, ROLE_EXP } from '../../../constants';
import { GetDefaultApprovers } from '../../../utils/approver';
import { getOuDisplayName, hierarchyConverse } from '../../../utils/hierarchy';
import { isApproverValid } from '../../../service/ApproverService';
import { debounce } from 'lodash';
import configStore from '../../../store/Config';
import InfoPopup from '../../InfoPopup';
import { Link } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  hierarchy: Yup.object().required('יש לבחור היררכיה'),
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
        let isTotalValid = true;

        if (context.parent?.hierarchy?.id && Array.isArray(approvers)) {
          await Promise.all(
            approvers.map(async (approver) => {
              const { isValid } = await isApproverValid(
                approver.entityId,
                context.parent.hierarchy.id
              );
              if (!isValid) isTotalValid = false;
            })
          );
        }

        return isTotalValid;
      },
    }),
  comments: Yup.string().optional(),
  clearance: Yup.string().required('יש לבחור סיווג'),
  roleName: Yup.string()
    .required('יש למלא שם תפקיד')
    .matches(ROLE_EXP, 'שם לא תקין'),
  isTafkidan: Yup.boolean().default(false),
  isJobTitleAlreadyTaken: Yup.boolean()
    .oneOf([false], 'התפקיד תפוס')
    .test({
      name: 'valid-role-name-not-taken',
      message: 'התפקיד תפוס',
      test: async (_, context) => {
        if (context.parent?.hierarchy?.id) {
          try {
            const isJobTitleAlreadyTaken = await isJobTitleAlreadyTakenRequest(
              context.parent?.roleName,
              context.parent?.hierarchy.id
            );

            return (
              context.parent.roleName &&
              !isJobTitleAlreadyTaken?.isJobTitleAlreadyTaken
            );
          } catch (error) {
            return true;
          }
        } else {
          return true;
        }
      },
    }),
  JobTitleSuggestions: Yup.array().default([]),
});

const RenameSingleOGForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject, clickTracking }, ref) => {
    const { appliesStore, userStore } = useStores();
    const [defaultApprovers, setDefaultApprovers] = useState([]);
    const isUserApprover = isUserApproverType(userStore.user);

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState,
      getValues,
      clearErrors,
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover },
    });
    const { errors } = formState;

    useEffect(async () => {
      if (requestObject) {
        setValue('comments', requestObject.comments);
        setValue('clearance', requestObject.kartoffelParams.clearance);
        setValue('roleName', requestObject.kartoffelParams.jobTitle);
        setValue('hierarchy', {
          name: requestObject.kartoffelParams.hierarchy,
        });
        setValue('isTafkidan', !!requestObject.kartoffelParams.roleEntityType);
        setValue('roleName', requestObject.kartoffelParams.jobTitle);
        setValue('upn', requestObject.kartoffelParams.upn);
        setValue('roleId', requestObject.kartoffelParams.roleId);

        const result = await GetDefaultApprovers({
          request: requestObject,
          onlyForView,
          user: userStore.user,
        });
        setDefaultApprovers(result || []);
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
          source: configStore.USER_SOURCE_DI,
          type: configStore.USER_DI_TYPE,
          clearance,
          roleEntityType: isTafkidan
            ? configStore.USER_ROLE_ENTITY_TYPE
            : undefined,
          hierarchy: hierarchyConverse(hierarchy),
        },
        adParams: {
          ouDisplayName: getOuDisplayName(hierarchy.hierarchy, hierarchy.name),
          jobTitle: roleName,
        },
        comments,
        due: Date.now(),
      };

      await appliesStore.createRoleApply(req);
      clickTracking('יצירת', 'תפקיד חדש');
      setIsActionDone(true);
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: handleSubmit(onSubmit),
      }),
      []
    );

    const debouncedRoleName = useRef(
      debounce(async (roleNameToSearch, directGroup) => {
        const result = await isJobTitleAlreadyTakenRequest(
          roleNameToSearch,
          directGroup
        );
        setValue('JobTitleSuggestions', result.suggestions);
        setValue('isJobTitleAlreadyTaken', result.isJobTitleAlreadyTaken, {
          shouldValidate: true,
        });
      }, 300)
    );

    const onRoleNameChange = (e) => {
      const roleNameToSearch = e.target.value;
      clearErrors('roleName');

      setValue('roleName', e.target.value, { shouldValidate: true });

      if (roleNameToSearch && getValues('hierarchy')?.id) {
        debouncedRoleName.current(roleNameToSearch, getValues('hierarchy').id);
      }
    };

    const onAvailableRoleName = (e) => {
      setValue('roleName', e.target.innerHTML);

      clearErrors('isJobTitleAlreadyTaken');
      setValue('isJobTitleAlreadyTaken', false, { shouldValidate: true });
    };

    const handleOrgSelected = async (org) => {
      const result = await GetDefaultApprovers({
        request: requestObject,
        user: userStore.user,
        onlyForView,
        groupId: org.id,
      });
      setDefaultApprovers(result || []);
      setValue('isUserApprover', result.length > 0);
      setValue('approvers', []);
    };

    return (
      <div className="p-fluid" id="createSingleRoleForm">
        <span
          style={{
            // marginRight: '60px',
            marginBottom: '30px',
            // marginTop: '-20px',
            fontSize: '85%',
            color: '#73777B',
          }}
        >
          פתיחת תפקיד חדש (t ריק) תחת היררכיה נבחרת.
          <br />
          "תפקיד" הינו הערך האחרון בשורת ההיררכיה לדוגמה "מערך / מטה/………./ מדור
          X/ <b>יועץ מס</b>- ישראל ישראלי"
          <br />( במידה וברצונך לעדכן את שם התפקיד שלך, אנא עבור לטבלת
          <Link to="/listUsersPage"> רשימת תפקידים</Link>){/* </p> */}
        </span>
        <div
          className="display-flex title-wrap"
          style={{
            width: 'inherit',
            justifyContent: 'start',
            paddingBottom: '10px',
          }}
        >
          <h2 style={{ padding: 0 }}>היררכיה </h2>
          <InfoPopup
            infoText={`שימו לב❣️
            תפקיד חדש משמעותו פתיחת T חדש ריק ללא היסטוריה קודמת!`}
            name="מעבר לתפקיד"
            visible={!onlyForView}
            withTitle={true}
            warning
          ></InfoPopup>
        </div>

        <div className="p-fluid-item p-fluid-item-flex1">
          <div className="p-field">
            <Hierarchy
              setValue={setValue}
              name="hierarchy"
              errors={errors}
              ogValue={watch('hierarchy')}
              disabled={onlyForView}
              userHierarchy={
                userStore.user && userStore.user.hierarchy
                  ? userStore.user.hierarchy
                  : null
              }
              onOrgSelected={handleOrgSelected}
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
                  {watch('isJobTitleAlreadyTaken') ||
                  errors.isJobTitleAlreadyTaken?.type ===
                    'valid-role-name-not-taken'
                    ? 'תפוס'
                    : 'פנוי'}
                </i>
              )}
              <InputText
                {...register('roleName')}
                id="createSingleRoleForm-roleName"
                onChange={onRoleNameChange}
                disabled={onlyForView}
              />
              <label>
                {(errors.roleName || errors.isJobTitleAlreadyTaken) && (
                  <small style={{ color: 'red' }}>
                    {errors?.roleName?.message
                      ? errors.roleName?.message
                      : errors.isJobTitleAlreadyTaken?.message
                      ? errors.isJobTitleAlreadyTaken.message
                      : 'יש למלא ערך'}
                  </small>
                )}
              </label>
            </span>
          </div>
        </div>
        {watch('isJobTitleAlreadyTaken') && (
          <div
            className="p-fluid-item p-fluid-item-flex1"
            style={{ alignItems: 'baseline', whiteSpace: 'pre-wrap' }}
          >
            <div
              className="p-field"
              style={{ display: 'flex' }}
              id="createSingleRoleForm-freeNames"
            >
              <div style={{ marginTop: '35px' }}>שמות פנויים:</div>
              <div
                style={{ margin: '20px', display: 'flex', flexWrap: 'wrap' }}
              >
                {watch('JobTitleSuggestions').map((suggestion) => (
                  <Button
                    className="p-button-secondary p-button-outlined"
                    style={{ width: 'auto' }}
                    onClick={onAvailableRoleName}
                  >
                    {suggestion}
                  </Button>
                ))}
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
              id="createSingleRoleForm-clearance"
              options={ROLE_CLEARANCE}
              placeholder="סיווג תפקיד"
              {...register('clearance')}
              value={watch('clearance')}
              disabled={onlyForView}
            />
            <label>
              {errors.clearance && (
                <small style={{ color: 'red' }}>
                  {errors.clearance?.message
                    ? errors.clearance.message
                    : 'יש למלא ערך'}
                </small>
              )}
            </label>
          </div>
        </div>

        {onlyForView && requestObject.kartoffelParams.roleId && (
          <div className="p-fluid-item p-fluid-item">
            <div className="p-field">
              <label>מזהה תפקיד (T)</label>
              <span className="p-input-icon-left">
                <InputText
                  {...register('roleId')}
                  id="createSingleRoleForm-roleId"
                  disabled={onlyForView}
                />
              </span>
            </div>
          </div>
        )}

        {onlyForView &&
          configStore.USER_ROLE_ENTITY_TYPE ===
            requestObject.kartoffelParams.roleEntityType &&
          requestObject.kartoffelParams.upn && (
            <div className="p-fluid-item p-fluid-item">
              <div className="p-field">
                <label>מזהה כרטיס</label>
                <span className="p-input-icon-left">
                  <InputText
                    {...register('upn')}
                    id="createSingleRoleForm-upn"
                    disabled={onlyForView}
                  />
                </span>
              </div>
            </div>
          )}

        <div className="p-fluid-item">
          <Approver
            setValue={setValue}
            name="approvers"
            tooltip='רס"ן ומעלה ביחידתך'
            multiple={true}
            errors={errors}
            disabled={onlyForView || watch('isUserApprover')}
            defaultApprovers={defaultApprovers}
          />
        </div>
        <div
          className="p-field-checkbox"
          style={{ marginBottom: '10px', marginTop: '10px' }}
        >
          <Checkbox
            id="createSingleRoleForm-isTafkidan"
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
              id="createSingleRoleForm-comments"
              autoResize="false"
              disabled={onlyForView}
              placeholder={!onlyForView && 'הכנס הערות לבקשה...'}
            />
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

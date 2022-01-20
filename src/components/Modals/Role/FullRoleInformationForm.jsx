import * as Yup from 'yup';
import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputText } from 'primereact/inputtext';
import datesUtil from '../../../utils/dates';
import { debounce } from 'lodash';

import Hierarchy from '../../Fields/Hierarchy';
import { useStores } from '../../../context/use-stores';
import { isUserApproverType, isUserHoldType } from '../../../utils/user';
import { ROLE_CLEARANCE, ROLE_EXP, USER_TYPE } from '../../../constants';
import {
  getEntityByRoleId,
  getRoleByRoleId,
  getDIByUniqueId,
  isJobTitleAlreadyTakenRequest,
} from '../../../service/KartoffelService';
import Approver from '../../Fields/Approver';
import { GetDefaultApprovers } from '../../../utils/approver';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { getSamAccountNameFromUniqueId } from '../../../utils/fields';
import { CanEditRoleFields } from '../../../utils/roles';
import { Dropdown } from 'primereact/dropdown';

const FullRoleInformationForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject, reqView = true }, ref) => {
    const { appliesStore, userStore } = useStores();
    const [isJobTitleAlreadyTaken, setIsJobTitleAlreadyTaken] = useState(false);
    const [jobTitleSuggestions, setJobTitleSuggestions] = useState([]);
    const [entity, setEntity] = useState({});
    const [role, setRole] = useState();
    const [digitalIdentity, setDigitalIdentity] = useState();
    const [defaultApprovers, setDefaultApprovers] = useState([]);

    const isUserApprover = isUserApproverType(userStore.user);
    const canEditRoleFields = CanEditRoleFields(role);
    const isUserSecurity =
      isUserHoldType(userStore.user, USER_TYPE.SECURITY) ||
      isUserHoldType(userStore.user, USER_TYPE.SUPER_SECURITY);

    const validationSchema = Yup.object().shape({
      isUserApprover: Yup.boolean(),
      canEditRoleFields: Yup.boolean(),
      isUserSecurity: Yup.boolean(),
      approvers: Yup.array().when('isUserApprover', {
        is: false,
        then: Yup.array()
          .min(1, 'יש לבחור לפחות גורם מאשר אחד')
          .required('יש לבחור לפחות גורם מאשר אחד'),
      }),
      roleName: Yup.string().when('canEditRoleFields', {
        is: true,
        then: Yup.string()
          .matches(ROLE_EXP, 'תפקיד לא תקין')
          .required('יש לבחור שם תפקיד')
          .test({
            name: 'jobTitle-changed',
            message: 'נא לבחור שם חדש',
            test: (value) => {
              return value !== requestObject.jobTitle;
            },
          })
          .test({
            name: 'jobTitle-valid-check',
            message: 'תפקיד תפוס',
            test: () => {
              return !isJobTitleAlreadyTaken;
            },
          }),
      }),
      clearance: Yup.string().when('isUserSecurity', {
        is: true,
        then: Yup.string().required('יש לבחור סיווג'),
      }),
      comments: Yup.string().optional(),
    });

    const debouncedRoleName = useRef(
      debounce(async (roleNameToSearch, roleCheck) => {
        if (roleNameToSearch && roleCheck.directGroup) {
          const result = await isJobTitleAlreadyTakenRequest(
            roleNameToSearch,
            roleCheck.directGroup
          );
          setIsJobTitleAlreadyTaken(result.isJobTitleAlreadyTaken);
          setJobTitleSuggestions(result.suggestions);
        }
      }, 300)
    );

    const defaultValues = {
      comments: reqView ? requestObject?.comments : '',
      roleName: reqView
        ? requestObject?.kartoffelParams?.jobTitle
        : requestObject.jobTitle,
      clearance: reqView
        ? requestObject?.kartoffelParams?.clearance
        : requestObject.clearance,
      isUserApprover,
      canEditRoleFields,
      isUserSecurity,
    };

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState,
      clearErrors,
      reset,
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: defaultValues,
    });
    const { errors } = formState;

    useEffect(async () => {
      if (requestObject) {
        setValue('comments', reqView ? requestObject?.comments : '');
        setValue(
          'roleName',
          reqView
            ? requestObject?.kartoffelParams?.jobTitle
            : requestObject.jobTitle
        );

        if (reqView) {
          // TODO: change in req
          const role = await getRoleByRoleId(
            requestObject.kartoffelParams.roleId
          );
          setRole(role);
        } else {
          setRole(requestObject);
        }
      }

      const result = await GetDefaultApprovers({
        request: requestObject,
        onlyForView,
        user: userStore.user,
        groupId: role?.directGroup,
      });
      setDefaultApprovers(result || []);
      setValue('isUserApprover', result.length > 0);
    }, [requestObject]);

    useEffect(async () => {
      try {
        const entityRes = await getEntityByRoleId(
          requestObject?.roleId || requestObject?.kartoffelParams?.roleId
        );
        setEntity(entityRes);
      } catch (error) {
        // TODO: POPUP
      }

      try {
        if (requestObject?.digitalIdentityUniqueId) {
          const di = await getDIByUniqueId(
            requestObject.digitalIdentityUniqueId
          );
          setDigitalIdentity(di);
        }
      } catch (error) {
        // TODO: POPUP
      }
    }, [requestObject]);

    const onSubmit = async (data) => {
      try {
        await validationSchema.validate(data);
      } catch (err) {
        console.log(err);
        throw new Error(err.errors);
      }
      const { approvers, comments, roleName, clearance } = data;
      const req = {
        commanders: approvers,
        kartoffelParams: {
          roleId: requestObject.roleId,
          jobTitle: roleName,
          oldJobTitle: requestObject.jobTitle,
          ...(clearance && { clearance }),
        },
        adParams: {
          samAccountName: getSamAccountNameFromUniqueId(requestObject.roleId),
          jobTitle: roleName,
        },
        comments,
        due: Date.now(),
      };

      await appliesStore.renameRoleApply(req);
      setIsActionDone(true);
    };

    const onRoleNameChange = (e) => {
      const roleNameToSearch = e.target.value;
      setValue('roleName', roleNameToSearch, { shouldValidate: true });
      debouncedRoleName.current(roleNameToSearch, role);
    };

    const onAvailableRoleName = (e) => {
      setValue('roleName', e.target.innerHTML);
      setIsJobTitleAlreadyTaken(false);
      setJobTitleSuggestions([]);
      clearErrors('roleName');
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: handleSubmit(onSubmit),
        resetForm: () => {
          setValue(
            'roleName',
            reqView
              ? requestObject?.kartoffelParams?.jobTitle
              : requestObject.jobTitle
          );
          setValue('comments', reqView ? requestObject?.comments : '');
        },
      }),
      []
    );

    return (
      <div className='p-fluid'>
        <div className='p-fluid-item p-fluid-item'>
          <div className='p-field'>
            <label>
              <span className='required-field'>*</span>
              {reqView ? 'שם תפקיד חדש' : 'שם תפקיד'}
            </label>
            <span className='p-input-icon-left'>
              {watch('roleName') && !onlyForView && (
                <i>{isJobTitleAlreadyTaken ? 'תפוס' : 'פנוי'}</i>
              )}
              <InputText
                id='editSingleRoleForm-roleName'
                {...register('roleName')}
                onChange={onRoleNameChange}
                disabled={onlyForView || !canEditRoleFields}
              />
              <label>
                {errors.roleName && (
                  <small style={{ color: 'red' }}>
                    {errors.roleName?.message
                      ? errors.roleName?.message
                      : 'יש למלא ערך'}
                  </small>
                )}
              </label>
            </span>
          </div>
        </div>
        {isJobTitleAlreadyTaken && (
          <div
            className='p-fluid-item p-fluid-item-flex1'
            style={{ alignItems: 'baseline', whiteSpace: 'pre-wrap' }}
          >
            <div className='p-field' style={{ display: 'flex' }}>
              <div style={{ marginTop: '35px' }}>שמות פנויים:</div>
              <div
                style={{ margin: '20px', display: 'flex', flexWrap: 'wrap' }}
              >
                {jobTitleSuggestions.map((suggestion) => (
                  <Button
                    className='p-button-secondary p-button-outlined'
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

        {reqView && (
          <div className='p-fluid-item p-fluid-item'>
            <div className='p-field'>
              <label> שם תפקיד ישן </label>
              <InputText
                id='fullRoleInfoForm-oldJobTitle'
                value={
                  requestObject?.kartoffelParams?.oldJobTitle ||
                  role?.jobTitle ||
                  '---'
                }
                disabled={onlyForView}
              />
            </div>
          </div>
        )}

        {!reqView && (
          <div className='p-fluid-item-flex p-fluid-item'>
            <div className='p-field'>
              <Hierarchy
                disabled={true}
                name='hierarchy'
                labelText='היררכיה'
                errors={errors}
                ogValue={role?.hierarchy}
                userHierarchy={
                  userStore.user && userStore.user.hierarchy
                    ? userStore.user.hierarchy
                    : null
                }
              />
            </div>
          </div>
        )}

        <div className='p-fluid-item p-fluid-item'>
          <div className='p-field'>
            <label> מזהה תפקיד </label>
            <InputText
              id='fullRoleInfoForm-roleId'
              value={role?.roleId || '---'}
              disabled={true}
            />
          </div>
        </div>

        {!reqView && (
          <div className='p-fluid-item p-fluid-item'>
            <div className='p-field'>
              <label> תאריך עדכון </label>
              <InputText
                value={
                  role?.updatedAt
                    ? datesUtil.formattedDateTime(role.updatedAt)
                    : '---'
                }
                id='fullRoleInfoForm-updatedAt'
                disabled={true}
              />
            </div>
          </div>
        )}

        {!reqView && (
          <div className='p-fluid-item p-fluid-item'>
            <div className='p-field'>
              <label> סיווג התפקיד </label>
              <Dropdown
                id='fullRoleInfoForm-clearance'
                options={ROLE_CLEARANCE}
                placeholder={watch('clearance') || '---'}
                {...register('clearance')}
                value={watch('clearance')}
                disabled={onlyForView || !isUserSecurity}
              />
              <label>
                {errors.clearance && (
                  <small style={{ color: 'red' }}>
                    {errors.clearance?.message
                      ? errors.clearance?.message
                      : 'יש למלא ערך'}
                  </small>
                )}
              </label>
              {/* <InputText id="fullRoleInfoForm-clearance" value={role?.clearance || "---"} disabled={true} /> */}
            </div>
          </div>
        )}

        {!reqView && (
          <div className='p-fluid-item p-fluid-item'>
            <div className='p-field'>
              <label> משתמש בתפקיד </label>
              <InputText
                id='fullRoleInfoForm-entity'
                value={entity?.fullName || '---'}
                disabled={true}
              />
            </div>
          </div>
        )}

        {!reqView && (
          <div className='p-fluid-item p-fluid-item'>
            <div className='p-field'>
              <label> מזהה כרטיס </label>
              <InputText
                id='fullRoleInfoForm-upn'
                value={digitalIdentity?.upn ? digitalIdentity.upn : '---'}
                disabled={true}
              />
            </div>
          </div>
        )}

        {!(!reqView && onlyForView) && (
          <div className='p-fluid-item'>
            <Approver
              setValue={setValue}
              name='approvers'
              tooltip='רס"ן ומעלה ביחידתך'
              multiple={true}
              errors={errors}
              disabled={onlyForView || watch('isUserApprover')}
              defaultApprovers={defaultApprovers}
            />
          </div>
        )}

        {(reqView || !onlyForView) && (
          <div className='p-fluid-item p-fluid-item-flex1'>
            <div className='p-field'>
              <label>
                <span></span>הערות
              </label>
              <InputTextarea
                {...register('comments')}
                id='fullRoleInfoForm-comments'
                type='text'
                placeholder='הכנס הערות לבקשה...'
                disabled={onlyForView}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export { FullRoleInformationForm };

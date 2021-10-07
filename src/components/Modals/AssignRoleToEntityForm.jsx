import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import Hierarchy from './Hierarchy';
import Approver from './Approver';
import { useStores } from '../../context/use-stores';
import { toJS } from 'mobx';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  searchEntitiesByFullName,
  getRolesUnderOG,
  getRoleByRoleId,
  getOGById,
  getEntityByIdentifier,
  getEntityByRoleId,
} from '../../service/KartoffelService';

// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
  userName: Yup.string().required(),
  personalNumber: Yup.string().required(),
  hierarchy: Yup.object().required(),
  role: Yup.object().required(),
  roleId: Yup.string().required(),
  approvers: Yup.array().min(1).required(),
  comments: Yup.string().optional(),
});

const AssignRoleToEntityForm = forwardRef(({ showJob = true, setIsActionDone }, ref) => {
  const { appliesStore, userStore } = useStores();
  const { register, handleSubmit, setValue, getValues, watch, formState } =
    useForm({
      resolver: yupResolver(validationSchema)
    });
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [roles, setRoles] = useState([]);
  const { errors } = formState;

  const onSubmit = async (data) => {
    try {
      await validationSchema.validate(data);
    } catch (err) {
      throw new Error(err.errors);
    }
    const { changeRoleAt, approvers, personalNumber, roleId, comments, user } =
      data;
    const userRole = getUserRole();
    const req = {
      commanders: approvers,
      kartoffelParams: {
        id: user.id,
        uniqueId: roleId,
        needDisconnect: true,
      },
      adParams: {
        oldSAMAccountName: userRole?.roleId,
        newSAMAccountName: roleId,
        upn: '???', // TODO: WTF is this??
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        rank: user.rank,
        roleSerialCode: '???', // TODO: WTF is this??,
      },
      comments,
      due: changeRoleAt ? new Date(changeRoleAt).getTime() : Date.now(),
    };
    await appliesStore.assignRoleToEntityApply(req);
    setIsActionDone(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: handleSubmit(onSubmit),
    }),
    []
  );

  const getUserRole = () => {
    const user = watch('user');

    if (!user) {
      return null;
    }

    const relevantIdentity = user.digitalIdentities.find(
      (identity) => identity.source === 'oneTree'
    );

    if (relevantIdentity && relevantIdentity.role) {
      return relevantIdentity.role;
    }

    return null;
  };

  const setCurrentUser = () => {
    const user = toJS(userStore.user);
    setValue('user', user);
    setValue('userName', user.displayName);
    setValue('personalNumber', user.personalNumber || user.identityCard);
  };

  const onSearchUser = async (event) => {
    const result = await searchEntitiesByFullName(event.query);
    setUserSuggestions(result.entities || []);
  };

  const handleOrgSelected = async (org) => {
    const result = await getRolesUnderOG(org.id);
    setRoles(result.roles || []);
  };

  const onSearchUserById = async () => {
    const userId = getValues('personalNumber');

    if (!userId) {
      return;
    }

    const user = await getEntityByIdentifier(userId);

    if (user) {
      setValue('user', user);
      setValue('userName', user.fullName);
      setValue('userRole', user.jobTitle);
    }
  };

  const handleRoleSelected = async (roleId) => {
    const entity = await getEntityByRoleId(roleId);

    if (entity) {
      setValue('currentRoleUser', entity.fullName);
    }
  };

  const onRoleIdChanged = async () => {
    const roleId = getValues('roleId');

    if (!roleId) {
      return;
    }

    let role = roles.find((role) => role.digitalIdentityUniqueId === roleId);

    if (!role) {
      role = await getRoleByRoleId(roleId);
    }

    let hierarchy = getValues('hierarchy');

    if (!hierarchy) {
      hierarchy = await getOGById(role.directGroup);
    }

    setValue('hierarchy', hierarchy);
    setRoles(Array.from(new Set([...roles, role])));
    setValue('role', role);

    handleRoleSelected(role.roleId);
  };

  const userRole = getUserRole();
  const userRoleDisplay = userRole ? userRole.jobTitle : ' - ';

  return (
    <div className='p-fluid'>
      <div className='p-fluid-item-flex p-fluid-item'>
        <button
          className='btn-underline left19'
          onClick={setCurrentUser}
          type='button'
          title='עבורי'
        >
          עבורי
        </button>
        <div className='p-field'>
          <label htmlFor='2020'>
            {' '}
            <span className='required-field'>*</span>שם משתמש
          </label>
          <AutoComplete
            value={watch('userName')}
            suggestions={userSuggestions}
            completeMethod={onSearchUser}
            id='2020'
            type='text'
            field='fullName'
            onSelect={(e) => {
              setValue('user', e.value);
              setValue('personalNumber', e.value.personalNumber || e.value.identityCard);
              setValue('userRole', e.value.jobTitle);
            }}
            onChange={(e) => {
              setValue('userName', e.value?.displayName);
            }}
            required
          />
          <label htmlFor='2020'>
            {' '}
            {errors.userName && <small style={{ color: "red" }}>יש למלא ערך</small>}
          </label>
        </div>
      </div>
      <div className='p-fluid-item-flex p-fluid-item'>
        <div className='p-field'>
          <label htmlFor='2021'>
            {' '}
            <span className='required-field'>*</span>מ"א/ת"ז
          </label>
          <InputText
            {...register('personalNumber', { required: true })}
            id='2021'
            type='text'
            required
            onBlur={onSearchUserById}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearchUserById();
              }
            }}
          />
          <label htmlFor='2021'>
            {' '}
            {errors.personalNumber && <small style={{ color: "red" }}>יש למלא ערך</small>}
          </label>
        </div>
      </div>
      {showJob ? <div className='p-fluid-item' >
        <div className='p-field p-field-blue'>
          <label htmlFor='2022'>תפקיד</label>
          <InputText
            id='2022'
            disabled
            type='text'
            placeholder='תפקיד'
            value={userRoleDisplay}
          />
        </div>
      </div> : null}
      <div className='p-fluid-item p-fluid-item-flex1'>
        <hr />
        <h2>מעבר לתפקיד</h2>
      </div>
      <div className='p-fluid-item-flex p-fluid-item'>
        <Hierarchy
          value={watch('hierarchy')}
          setValue={setValue}
          name='hierarchy'
          onOrgSelected={handleOrgSelected}
          errors={errors}
        />
      </div>
      {watch('currentRoleUser') && (
        <div className='p-fluid-item-flex p-fluid-item'>
          <div
            className={`p-field ${watch('currentRoleUser') ? 'p-field-red' : 'p-field-green'
              }`}
          >
            <label htmlFor='2024'>סטטוס תפקיד</label>
            <InputText
              {...register('roleStatus')}
              id='2024'
              disabled
              type='text'
              placeholder={watch('currentRoleUser') ? 'לא פנוי' : 'פנוי'}
            />
          </div>
        </div>
      )}
      <div className='row3flex'>
        <div className='p-fluid-item '>
          <div className='p-field p-field-blue'>
            <label htmlFor='2025'>שם תפקיד</label>
            <Dropdown
              {...register('role')}
              inputId='2025'
              options={roles}
              placeholder='שם תפקיד'
              optionLabel='jobTitle'
              value={watch('role')}
              onChange={(e) => {
                setValue('role', e.value);
                setValue('roleId', e.value.digitalIdentityUniqueId);
                handleRoleSelected(e.value.roleId);
              }}
            />
            <label htmlFor='2021'>
              {' '}
              {errors.role && <small style={{ color: "red" }}>יש למלא ערך</small>}
            </label>
          </div>
        </div>
        <div className='p-fluid-item'>
          <div className='p-field'>
            <label htmlFor='2026'>מזהה תפקיד (T)</label>
            <InputText
              {...register('roleId')}
              id='2026'
              type='text'
              onBlur={onRoleIdChanged}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onRoleIdChanged();
                }
              }}
            />
            <label htmlFor='2021'>
              {' '}
              {errors.roleId && <small style={{ color: "red" }}>יש למלא ערך</small>}
            </label>
          </div>
        </div>
        <div className='p-fluid-item'>
          <Approver setValue={setValue} name='approvers' multiple={true} />
        </div>
      </div>
      {watch('currentRoleUser') && (
        <div className='row3flex'>
          <div className='p-fluid-item' style={{ width: '68%' }}>
            <div className='p-field'>
              <label htmlFor='2030'>מבצע תפקיד</label>
              <InputText
                {...register('currentRoleUser')}
                id='2030'
                type='text'
                disabled
                placeholder='מבצע תפקיד'
              />
            </div>
          </div>
          <div className='p-fluid-item'>
            <div className='p-field'>
              <label htmlFor='2027'>בצע החלפה בתאריך</label>
              <Calendar
                {...register('changeRoleAt')}
                id='2027'
                showTime
                value={watch('changeRoleAt')}
                onChange={(e) => setValue('changeRoleAt', e.target.value)}
                placeholder='בצע החלפה בתאריך'
              />
              <label htmlFor='2021'>
                {' '}
                {errors.changeRoleAt && <small style={{ color: "red" }}>יש למלא ערך</small>}
              </label>
            </div>
          </div>
        </div>
      )}
      <div className='p-fluid-item p-fluid-item-flex1'>
        <div className='p-field'>
          <label htmlFor='2028'>סיבת מעבר</label>
          <InputTextarea
            {...register('comments')}
            id='2028'
            type='text'
            placeholder='הערות'
          />
        </div>
      </div>
    </div>
  );
});

export default AssignRoleToEntityForm;

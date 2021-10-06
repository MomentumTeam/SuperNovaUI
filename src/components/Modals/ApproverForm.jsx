import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import Hierarchy from './Hierarchy';
import Approver from './Approver';
import { AutoComplete } from 'primereact/autocomplete';
import '../../assets/css/local/components/approverForm.css'
// import { assignRoleToEntityRequest } from '../../service/AppliesService';
import { useStores } from '../../context/use-stores';
import { toJS } from 'mobx';
import * as Yup from 'yup';

import {
  searchEntitiesByFullName,
  getEntityByIdentifier,
} from '../../service/KartoffelService';

const approverTypes = [
  { label: 'גורם מאשר ראשוני', value: 'COMMANDER' },
  { label: 'גורם מאשר יחב"ם', value: 'SECURITY' },
  { label: 'גורם מאשר בטח"ם', value: 'SUPER_SECURITY' },
  { label: 'הרשאת בקשה מרובה', value: 'BULK' },
  { label: 'משתמש על', value: 'ADMIN' },
];

const validationSchema = Yup.object().shape({
  userName: Yup.string().required().min(1).label("שם משתמש"),
  personalNumber: Yup.string().required().min(1).label('מ"א/ת"ז'),
  hierarchy: Yup.string().required().min(1).label('היררכיה'),
  approverType: Yup.string().required().label('סוג גורם מאשר'),
  approvers: Yup.array().min(1).required().label('גורם מאשר'),
  comments: Yup.string().optional(),
});

const ApproverForm = forwardRef((props, ref) => {
  const { appliesStore, userStore } = useStores();
  const [approverType, setApproverType] = useState();
  const { register, handleSubmit, setValue, getValues, formState, watch } = useForm();
  const [userSuggestions, setUserSuggestions] = useState([]);
  const { errors } = formState;

  useEffect(() => {
    setValue('approverType', 'COMMANDER');
    setApproverType('COMMANDER');
  }, []);

  const onSubmit = async (data) => {
    const {
      approvers,
      user,
      hierarchy,
      userName,
      personalNumber,
      approverType,
      comments,
    } = data;
    try {
      await validationSchema.validate(data, { abortEarly: false })
    } catch (err) {
      throw new Error("לא כל שדות החובה מולאו")
    }

    const req = {
      status: 'SUBMITTED',
      commanders: [...(approvers || [])],
      AdditionalParams: {
        entityId: user.id,
        displayName: '',
        domainUsers: (user?.digitalIdentities || []).map(({ uniqueId, mail }) => uniqueId || mail),
        akaUnit: user.akaUnit,
        hierarchy: hierarchy,
        personalNumber: user.personalNumber,
        identityCard: user.identityCard,
        type: approverType,
      },
      comments,
      due: Date.now(),
    };

    return await appliesStore.createNewApproverApply(req);
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: handleSubmit(onSubmit),
    }),
    []
  );

  const handleApprover = (e) => {
    setApproverType(e.value);
    setValue('approverType', e.value);
  };

  const onSearchUserByPersonalNumber = async () => {
    const userId = getValues('personalNumber');

    if (!userId) {
      return;
    }

    const user = await getEntityByIdentifier(userId);

    if (user) {
      setValue('user', user);
      setValue('userName', user.fullName);
      setValue('hierarchy', user.hierarchy);
    }
  };

  const onSearchUser = async (event) => {
    const result = await searchEntitiesByFullName(event.query);
    setUserSuggestions(result.entities || []);
  };

  const setCurrentUser = () => {
    const user = toJS(userStore.user);
    setValue('userName', user.displayName);
    setValue('user', user);
    setValue('personalNumber', user.personalNumber || user.identityCard);
    setValue('hierarchy', user.hierarchy);
  };

  return (
    <div className='p-fluid'>
      <div className='p-fluid-item p-fluid-item-flex1'>
        <div className='p-field'>
          <label htmlFor='2011'>
            <span className='required-field'>*</span>סוג גורם מאשר
          </label>
          <Dropdown
            {...register('approverType')}
            value={approverType}
            inputId='2011'
            required
            options={approverTypes}
            onChange={handleApprover}
          />
        </div>
      </div>
      <div className='p-fluid-item'>
        <div className='p-field'>
            <label htmlFor='2020'>
              {' '}
              <span className='required-field'>*</span>שם משתמש
            </label>
            <button
                className='btn-underline left19 approver-fillMe'
                onClick={setCurrentUser}
                type='button'
                title='עבורי'
              >
            עבורי
            </button>
            <AutoComplete
              value={watch('userName')}
              suggestions={userSuggestions}
              completeMethod={onSearchUser}
              id='approverForm-userName'
              type='text'
              field='fullName'
              onSelect={(e) => {
                setValue('user', e.value);
                setValue('personalNumber', e.value.personalNumber || e.value.identityCard);
                setValue('hierarchy', e.value.hierarchy);
              }}
              onChange={(e) => {
                setValue('userName', e.value);
              }}
              required
            />
            {errors.userName && <small>יש למלא ערך</small>}
          </div>
      </div>
      <div className='p-fluid-item'>
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
              onBlur={onSearchUserByPersonalNumber}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchUserByPersonalNumber();
                }
              }}
            />
            {errors.personalNumber && <small>יש למלא ערך</small>}
          </div>
        </div>
      <div className='p-fluid-item'>
        <Hierarchy disabled={true} setValue={setValue} name='hierarchy' ogValue={getValues('hierarchy')} />
      </div>
      <div className='p-fluid-item'>
        <Approver setValue={setValue} name='approvers' multiple={true} />
      </div>
      <div className='p-fluid-item p-fluid-item-flex1'>
        <div className='p-field'>
          <label htmlFor='2016'>הערות</label>
          <InputTextarea
            {...register('comments')}
            id='2016'
            type='text'
            placeholder='הערות'
          />
        </div>
      </div>
    </div>
  );
});

export default ApproverForm;

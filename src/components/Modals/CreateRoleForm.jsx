import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useForm } from "react-hook-form";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { createRoleRequest } from '../../service/AppliesService';
import Hierarchy from "./Hierarchy";
import Approver from './Approver';

const states = [
  { name: 'מספר1', code: 'מספר1' },
  { name: 'מספר2', value: 'מספר2' },
  { name: 'מספר3', code: 'מספר3' },
  { name: 'מספר4', code: 'מספר4' },
  { name: 'מספר5', code: 'מספר5' },
];

const CreateRoleForm = forwardRef(({ setIsActionDone }, ref) => {
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data) => {
    const {
      approver,
      hierarchy,
      userName,
      personalNumber,
      role,
      roleStatus,
      roleName,
      roleId,
      comments
    } = data
    const req = {
      status: "SUBMITTED",
      commanders: [{ ...approver, identityCard: "", personalNumber: 123456 }],
      kartoffelParams: {
        name: roleName,
        parent: hierarchy.id,
        source: "oneTree"
      },
      kartoffelStatus: { status: "STAGE_UNKNOWN" },
      adStatus: { status: "STAGE_UNKNOWN" },
      adParams: {
        ouDisplayName: hierarchy.name,
        ouName: hierarchy.name,
        name: roleName
      },
      comments,
      due: Date.now()
    }

    await createRoleRequest(req);
    setIsActionDone(true);
  }

  useImperativeHandle(ref, () => ({
    handleSubmit: handleSubmit(onSubmit)
  }), []);

  const setCurrentUser = () => {
    setValue("user", "ss")
    setValue("personalNumber", 1234)
  }

  return (
    <div className='p-fluid' >
      <div className='p-fluid-item'>
        <div className='p-field '>
          <label htmlFor='2020'>
            {' '}
            <span className='required-field'>*</span> שם תפקיד
          </label>
          <InputText {...register("roleName")} id='2020' type='text' required placeholder='שם תפקיד' />
        </div>
      </div>
      <div className='p-fluid-item'>
        <div className='p-field'>
          <label htmlFor='2021'>תגית תפקיד</label>
          <Dropdown
            {...register("roleTag")}
            inputId='2021'
            options={states}
            placeholder='תגית תפקיד'
            optionLabel='name'
          />
        </div>
      </div>
      <div className='p-fluid-item-flex p-fluid-item'>
        <Hierarchy setValue={setValue} name="parentHierarchy" />
        <Button className='pi pi-plus' type='button' label='Submit' />
      </div>
      <div className='p-fluid-item-flex p-fluid-item'>
        <Approver setValue={setValue} name="approver" />
        <Button className='pi pi-plus' type='button' label='Submit' />
      </div>
      <div className='p-fluid-item'>
        <button class='btn-underline' onClick={setCurrentUser} type='button' title='עבורי'>
          עבורי
        </button>
        <div className='p-field'>
          <label htmlFor='2024'>
            <span className='required-field'>*</span> משתמש בתפקיד{' '}
          </label>
          <InputText
            {...register("user")}
            id='2024'
            type='text'
            required
            placeholder='משתמש בתפקיד'
          />
        </div>
      </div>
      <div className='p-fluid-item'>
        <div className='display-flex'>
          <div className='p-field w50'>
            <label htmlFor='2025'>
              <span className='required-field'>*</span> מ"א{' '}
            </label>
            <InputText  {...register("personalNumber")} id='2025' type='text' required placeholder="מ''א" />
          </div>
          <div className='p-field w50'>
            <label htmlFor='2026'>סטטוס</label>
            <Dropdown
              {...register("status")}
              inputId='2026'
              options={states}
              placeholder='סטטוס'
              optionLabel='name'
            />
          </div>
        </div>
      </div>
      <div className='p-fluid-item'>
        <div className='p-field'>
          <label htmlFor='2027'>
            <span className='required-field'>*</span> פרטי תפקיד / תיאור{' '}
          </label>
          <InputTextarea
            {...register("roleDetails")}
            id='2027'
            type='text'
            required
            placeholder='פרטי תפקיד / תיאור'
            rows='4'
          />
        </div>
      </div>
      <div className='p-fluid-item'>
        <div className='p-field'>
          <label htmlFor='2028'>הערות</label>
          <InputTextarea {...register("comments")} id='2028' type='text' placeholder='הערות' rows='4' />
        </div>
      </div>
    </div>
  );
})

export default CreateRoleForm;

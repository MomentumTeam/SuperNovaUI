import React, { useState,useImperativeHandle,forwardRef } from 'react';
import { useForm } from "react-hook-form";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

const states = [
  { name: 'מספר1', code: 'מספר1' },
  { name: 'מספר2', value: 'מספר2' },
  { name: 'מספר3', code: 'מספר3' },
  { name: 'מספר4', code: 'מספר4' },
  { name: 'מספר5', code: 'מספר5' },
];

const EditOGForm = forwardRef((props, ref) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data)
  }

  useImperativeHandle(ref, () => ({
    handleSubmit:handleSubmit(onSubmit)
  }), []);


    return (
        <div className="p-fluid">
        <div className="p-fluid-item p-fluid-item-flex1">
            <div className="p-field">
                <label htmlFor="2020"> <span className="required-field">*</span>שם תפקיד</label>
                <InputText {...register("rolName")} id="2020" type="text" required placeholder="שם תפקיד" />
            </div>
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
            <div className="p-field">
                <label htmlFor="2021"><span className="required-field">*</span>היררכיה</label>
                <InputText  {...register("hierarchy")} id="2021" type="text" required placeholder="Select" placeholder="היררכיה" />
            </div>
            <Button className="pi pi-plus" type="button" label="Submit" />
        </div>
        <div className="p-fluid-item-flex p-fluid-item">
            <div className="p-field">
                <label htmlFor="2022"><span className="required-field">*</span>גורם מאשר</label>
                <Dropdown {...register("approve")} inputId="2022" required  options={states}  placeholder="גורם מאשר" optionLabel="name" />
            </div>
            <Button className="pi pi-plus" type="button" label="Submit" />
        </div>
        <div className="p-fluid-item">
            <button className="btn-underline" type="button" title="עבורי">עבורי</button>
            <div className="p-field">
                <label htmlFor="2023"><span className="required-field">*</span>משתמש בתפקיד</label>
                <InputText {...register("rolId")} id="2023" type="text" required placeholder="משתמש בתפקיד" />
            </div>
        </div>
        <div className="p-fluid-item">
            <div className="p-field">
                <label htmlFor="2024"><span className="required-field">*</span>מ"א</label>
                <InputText id="2024" type="text" required placeholder="מ''א" />
            </div>
        </div>
        <div className="p-fluid-item">
            <div className="p-field">
                <label htmlFor="2025"><span className="required-field">*</span>פרטי תפקיד / תיאור</label>
                <InputTextarea {...register("roldetails")} id="2025" type="text" required placeholder="פרטי תפקיד / תיאור" rows="4" />
            </div>
        </div>
        <div className="p-fluid-item">
            <div className="p-field">
                <label htmlFor="2026">הערות</label>
                <InputTextarea {...register("comments")} id="2026" type="text" placeholder="הערות" rows="4" />
            </div>
        </div>
    </div>
    );
})

export default EditOGForm;

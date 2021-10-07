import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import * as Yup from 'yup';
import { useStores } from '../../context/use-stores';
import Approver from './Approver';


const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    identityNumber: Yup.number().required(),
    phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required(),
    classification: Yup.number().required(),
    approvers: Yup.array().min(1).required(),
    comments: Yup.string().optional(),
    sex: Yup.number().optional().nullable()
});

const CreateSpecialEntityForm = forwardRef((props, ref) => {
    const { register, handleSubmit, watch, setValue } = useForm();
    const { appliesStore } = useStores();

    const onSubmit = async (data) => {
        try {
            await validationSchema.validate(data);
        } catch (err) {
            throw new Error(err.errors);
        }

        const { firstName, lastName, identityNumber, phone, classification, comments, sex, approvers } = data;

        const req = {
            commanders: approvers,
            kartoffelParams: {
                firstName,
                lastName,
                identityCard: identityNumber,
                mobilePhone: [phone],
                clearance: classification,
                sex,
                // TODO: put it correct type
                entityType: "???",
                serviceType: "???"
            },
            comments,
            adParams: {} // IS THIS NEEDED???
        };

        await appliesStore.createEntityApply(req);
    };

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit: handleSubmit(onSubmit),
        }),
        []
    );

    return (
        <div className='p-fluid'>
            <div className='p-fluid-item-flex p-fluid-item'>
                <div className='p-field'>
                    <label htmlFor="1900">
                        <span className="required-field">*</span>שם פרטי
                        <InputText
                            {...register('firstName')}
                            id='firstName'
                            type='text'
                        />
                    </label>
                </div>
            </div>
            <div className='p-fluid-item-flex p-fluid-item'>
                <div className='p-field'>
                    <label htmlFor="1900">
                        <span className="required-field">*</span>שם משפחה
                        <InputText
                            {...register('lastName')}
                            id='lastName'
                            type='text'
                        />
                    </label>
                </div>
            </div>
            <div className='p-fluid-item-flex p-fluid-item'>
                <div className='p-field'>
                    <label htmlFor="1900">
                        <span className="required-field">*</span>ת״ז
                        <InputText
                            {...register('identityNumber')}
                            id='identityNumber'
                            type='text'
                        />
                    </label>
                </div>
            </div>
            <div className='p-fluid-item-flex p-fluid-item'>
                <div className='p-field'>
                    <label htmlFor="1900">
                        <span className="required-field">*</span>טלפון
                        <InputText
                            {...register('phone')}
                            id='phone'
                            type='text'
                        />
                    </label>
                </div>
            </div>
            <div className='p-fluid-item-flex p-fluid-item'>
                <div className='p-field'>
                    <label htmlFor="1900">
                        <span className="required-field">*</span>סיווג המשתמש (מספר)
                        <InputText
                            {...register('classification')}
                            id='classification'
                            type='text'
                        />
                    </label>
                </div>
            </div>
            <div className='p-fluid-item-flex p-fluid-item'>
                <div className='p-field'>
                    <label htmlFor="1900">
                        מגדר
                        <Dropdown
                            {...register('sex')}
                            inputId='sex'
                            options={[
                                { label: '-', value: null },
                                { label: 'זכר', value: '1' },
                                { label: 'נקבה', value: '2' }
                            ]}
                            placeholder='מגדר'
                            value={watch('sex')}
                            onChange={(e) => {
                                setValue('sex', e.value);
                            }} />
                    </label>
                </div>
            </div>
            <div className='p-fluid-item'>
                <Approver setValue={setValue} name='approvers' multiple={true} />
            </div>
            <div className='p-fluid-item p-fluid-item-flex1'>
                <div className='p-field'>
                    <label htmlFor='2028'>הערות</label>
                    <InputTextarea
                        {...register('comments')}
                        id='comments'
                        type='text'
                    />
                </div>
            </div>
        </div>
    )
});

export default CreateSpecialEntityForm;

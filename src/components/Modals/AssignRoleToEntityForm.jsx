import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import Hierarchy from './Hierarchy';
import Approver from './Approver';
import { useStores } from '../../context/use-stores';
import { toJS } from 'mobx';

const states = [
    { name: 'מספר1', code: 'מספר1' },
    { name: 'מספר2', value: 'מספר2' },
    { name: 'מספר3', code: 'מספר3' },
    { name: 'מספר4', code: 'מספר4' },
    { name: 'מספר5', code: 'מספר5' },
];

const AssignRoleToEntityForm = forwardRef((props, ref) => {
    const { appliesStore, userStore } = useStores();
    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = async (data) => {
        const { approver, hierarchy, userName, personalNumber, role, roleStatus, roleName, roleId, comments } = data;

        const req = {
            status: 'SUBMITTED',
            commanders: [{ ...approver, identityCard: '', personalNumber: 123456 }],
            kartoffelParams: {
                name: roleName,
                parent: hierarchy.id,
                source: 'oneTree',
            },
            kartoffelStatus: { status: 'STAGE_UNKNOWN' },
            adStatus: { status: 'STAGE_UNKNOWN' },
            adParams: {
                oldSAMAccountName: '',
                newSAMAccountName: '',
                upn: '',
                firstName: '',
                lastName: '',
                fullName: '',
                rank: '',
                roleSerialCode: '',
            },
            comments,
            due: Date.now(),
        };
        console.log(req);
        return await appliesStore.assignRoleToEntityApply(req);
    };

    useImperativeHandle(
        ref,
        () => ({
            handleSubmit: handleSubmit(onSubmit),
        }),
        []
    );

    const setCurrentUser = () => {
        const user = toJS(userStore.user);
        setValue('userName', user.displayName);
        setValue('personalNumber', user.personalNumber);
    };

    return (
        <div className='p-fluid'>
            <div className='row3flex'>
                <div className='p-fluid-item'>
                    <button className='btn-underline left19' onClick={setCurrentUser} type='button' title='עבורי'>
                        עבורי
                    </button>
                    <div className='p-field'>
                        <label htmlFor='2020'>
                            {' '}
                            <span className='required-field'>*</span>שם משתמש
                        </label>
                        <InputText {...register('entity')} id='2020' type='text' required placeholder='שם משתמש' />
                    </div>
                </div>
                <div className='p-fluid-item'>
                    <div className='p-field'>
                        <label htmlFor='2021'>
                            {' '}
                            <span className='required-field'>*</span>מ"א/ת"ז
                        </label>
                        <InputText
                            {...register('personalNumber')}
                            id='2021'
                            type='text'
                            required
                            placeholder="מ''א/ת''ז"
                        />
                    </div>
                </div>
                <div className='p-fluid-item'>
                    <div className='p-field p-field-blue'>
                        <label htmlFor='2022'>תפקיד</label>
                        <InputText {...register('role')} id='2022' type='text' placeholder='צילום מתקדם1' />
                    </div>
                </div>
            </div>

            <div className='p-fluid-item p-fluid-item-flex1'>
                <hr />
                <h2>מעבר לתפקיד</h2>
            </div>

            <div className='p-fluid-item-flex p-fluid-item'>
                <Hierarchy setValue={setValue} name='hierarchy' />
            </div>

            <div className='p-fluid-item-flex p-fluid-item'>
                <div className='p-field p-field-green'>
                    <label htmlFor='2024'>סטטוס תפקיד</label>
                    <InputText {...register('roleStatus')} id='2024' type='text' placeholder='פנוי' />
                </div>
            </div>
            <div className='row3flex'>
                <div className='p-fluid-item '>
                    <div className='p-field p-field-blue'>
                        <label htmlFor='2025'>שם תפקיד</label>
                        <Dropdown
                            {...register('roleName')}
                            inputId='2025'
                            options={states}
                            placeholder='שם תפקיד'
                            optionLabel='name'
                        />
                    </div>
                </div>
                <div className='p-fluid-item'>
                    <div className='p-field'>
                        <label htmlFor='2026'>מזהה תפקיד</label>
                        <InputText {...register('roleId')} id='2026' type='text' placeholder='מזהה תפקיד' />
                    </div>
                </div>
                <div className='p-fluid-item'>
                    <Approver setValue={setValue} name='approver' />
                </div>
            </div>
            <div className='p-fluid-item p-fluid-item-flex1'>
                <div className='p-field'>
                    <label htmlFor='2028'>סיבת מעבר</label>
                    <InputTextarea {...register('comments')} id='2028' type='text' placeholder='הערות' />
                </div>
            </div>
        </div>
    );
});

export default AssignRoleToEntityForm;

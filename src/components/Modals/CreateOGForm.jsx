import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
// import { createOGRequest } from '../../service/AppliesService';
import { useStores } from '../../context/use-stores';
import Hierarchy from './Hierarchy';
import Approver from './Approver';

const CreateOGForm = forwardRef((props, ref) => {
    const { appliesStore } = useStores();
    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = async ({ newHierarchy, parentHierarchy, approvers, comments }) => {
        const req = {
            status: 'SUBMITTED',
            commanders: approvers,
            kartoffelParams: {
                name: newHierarchy,
                parent: parentHierarchy.id,
                source: 'oneTree',
            },
            kartoffelStatus: { status: 'STAGE_UNKNOWN' },
            adStatus: { status: 'STAGE_UNKNOWN' },
            adParams: {
                ouDisplayName: parentHierarchy.name,
                ouName: parentHierarchy.name,
                name: newHierarchy,
            },
            comments,
            due: Date.now(),
        };

        return await appliesStore.createOGApply(req);
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
            <div className='p-fluid-item p-fluid-item-flex1'>
                <Hierarchy setValue={setValue} name='parentHierarchy' labelText={'היררכיית אב'}/>
            </div>
            <div className='p-fluid-item'>
                <div className='p-field'>
                    <label htmlFor='2021'>
                        <span className='required-field'>*</span>שם היררכיה חדשה
                    </label>
                    <InputText
                        {...register('newHierarchy')}
                        id='2021'
                        type='text'
                        required
                    />
                </div>
            </div>
            <div className='p-fluid-item'>
                <Approver setValue={setValue} name='approvers' defaultApprovers={[]} multiple={true} />
            </div>
            <div className='p-fluid-item p-fluid-item-flex1'>
                <div className='p-field'>
                    <label htmlFor='2023'>הערות</label>
                    <InputTextarea {...register('comments')} id='2023' type='text' placeholder='הערות' />
                </div>
            </div>
        </div>
    );
});

export default CreateOGForm;

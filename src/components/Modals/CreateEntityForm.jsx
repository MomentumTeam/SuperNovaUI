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
import { Accordion, AccordionTab } from "primereact/accordion";


// TODO: move to different file (restructe project files...)
const validationSchema = Yup.object().shape({
    personalNumber: Yup.number().required()
});

const CreateEntityForm = forwardRef((props, ref) => {
    const { userStore } = useStores();
    const { register, handleSubmit, setValue, getValues, watch, formState } =
        useForm();
    const { errors } = formState;

    const onSubmit = async (data) => {
        throw new Error('asdasdasd')
        // get data from from and handle change (AD + kartoffel + etc' )
    };

    // must be used - doesnt do much
    useImperativeHandle(
        ref,
        () => ({
            handleSubmit: handleSubmit(onSubmit),
        }),
        []
    );

    const newEntityTab = () => {
        return (
            <div className='p-fluid'>
                <div className='row2flex'>
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
                            />
                            {errors.personalNumber && <small>יש למלא ערך</small>}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Accordion
            expandIcon="pi pi-chevron-left"
            activeIndex={0}
            style={{ "margin-bottom": "20px" }}
        >
            <AccordionTab header="משתמש חדש">
                {newEntityTab()}
            </AccordionTab>
            <AccordionTab header="משתמש מיוחד">

            </AccordionTab>
        </Accordion>)
});

export default CreateEntityForm;

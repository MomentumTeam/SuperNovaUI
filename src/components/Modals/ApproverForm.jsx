import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useForm } from "react-hook-form";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import Hierarchy from "./Hierarchy";
import Approver from './Approver';
import Entity from './Entity';
// import { assignRoleToEntityRequest } from '../../service/AppliesService';
import { useStores } from '../../hooks/use-stores';
import { toJS } from 'mobx';

const approverTypes = [
    {label: 'COMMANDER', value: 'COMMANDER'},
    {label: 'SECURITY', value: 'SECURITY'},
    {label: 'SUPER SECURITY', value: 'SUPER_SECURITY'}
];


const ApproverForm = forwardRef((props, ref) => {
    const { appliesStore, userStore } = useStores();
    const [ approverType, setApproverType ] = useState();
    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = async (data) => {

        const { 
            approver,
            entity,
            hierarchy,
            userName,
            personalNumber,
            approverType,
            comments
        } = data

        const req = {
            status: "SUBMITTED",
            commanders: [{ ...approver, identityCard: "", personalNumber: 123456 }],
            AdditionalParams: {
                entityId: entity.id,
                displayName: "",
                domainUsers: entity.map(),
                akaUnit: entity.akaUnit,
                type: approverType
            },
            comments,
            due: Date.now()
        }
        console.log(req)
        return await appliesStore.createApproverApply(req)
    }

    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit(onSubmit)
    }), []);
 
    const handleApprover = (e) => {
        setApproverType(e.value);
        setValue("approverType", e.value)
    }

    const setCurrentUser = () =>{
        const user = toJS(userStore.user);
        setValue("user", user.displayName)
        setValue("personalNumber", user.personalNumber)
      }

    return (
        <div className="p-fluid">
        <div className="p-fluid-item p-fluid-item-flex1">
            <div className="p-field">
                <label htmlFor="2011"><span className="required-field">*</span>סוג גורם מאשר</label>
                <Dropdown {...register("approverType")} value={approverType} inputId="2011" required options={approverTypes} onChange={handleApprover} placeholder="גורם מאשר ראשוני"  />
            </div>
        </div>
        <Entity setValue={setValue} name="entity"/>
        <div className="p-fluid-item">
            <Hierarchy setValue={setValue} name="hierarchy" />
        </div>
        <div className="p-fluid-item">
            <Approver setValue={setValue} name="approver" />
        </div>
        <div className="p-fluid-item p-fluid-item-flex1">
            <div className="p-field">
                <label htmlFor="2016">הערות</label>
                <InputTextarea {...register("comments")} id="2016" type="text" placeholder="הערות" />
            </div>
        </div>
    </div>
    );
})

export default ApproverForm;

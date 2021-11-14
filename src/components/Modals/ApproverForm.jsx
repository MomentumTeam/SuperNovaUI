import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import Hierarchy from './Hierarchy';
import Approver from '../Fields/Approver';
import { AutoComplete } from 'primereact/autocomplete';
import '../../assets/css/local/components/approverForm.css'
// import { assignRoleToEntityRequest } from '../../service/AppliesService';
import { useStores } from '../../context/use-stores';
import { toJS } from 'mobx';
import {
  searchEntitiesByFullName,
  getEntityByIdentifier,
} from '../../service/KartoffelService';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { USER_TYPE } from '../../constants';
import { isUserHoldType } from '../../utils/user';
import { GetDefaultApprovers } from '../../utils/approver';

const approverTypes = [
  { label: 'גורם מאשר ראשוני', value: 'COMMANDER' },
  { label: 'גורם מאשר יחב"ם', value: 'SECURITY' },
  { label: 'גורם מאשר בטח"ם', value: 'SUPER_SECURITY' },
  { label: 'הרשאת בקשה מרובה', value: 'BULK' },
  { label: 'מחשוב יחידתי', value: 'ADMIN' },
];

const validationSchema = Yup.object().shape({
  approverType: Yup.string().required("יש להכניס סוג מאשר"),
  user: Yup.object().required("יש לבחור משתמש"),
  hierarchy: Yup.string().required("יש לבחור היררכיה"),
  approvers: Yup.array().min(1, "יש לבחור לפחות גורם מאשר אחד").required("יש לבחור לפחות גורם מאשר אחד"),
  comments: Yup.string().optional(),
  userName: Yup.string().required("יש לבחור שם משתמש"),
});

const ApproverForm = forwardRef(({ onlyForView, requestObject, setIsActionDone }, ref) => {
  const { appliesStore, userStore } = useStores();
  const [approverType, setApproverType] = useState();
  const { register, handleSubmit, setValue, getValues, formState, watch } =
    useForm({
      resolver: yupResolver(validationSchema),
    });
  const [userSuggestions, setUserSuggestions] = useState([]);
  const { errors } = formState;

  useEffect(() => {
    setValue('approverType', 'COMMANDER');
    setApproverType('COMMANDER');

    if (requestObject) {
      setValue('comments', requestObject.comments);
      setValue('userName', requestObject.additionalParams.displayName);
      setValue('hierarchy', requestObject.additionalParams.directGroup);
      setValue('personalNumber', requestObject.additionalParams.personalNumber || requestObject.additionalParams.identityCard);
      setApproverType(requestObject.additionalParams.type);
    }
  }, []);

  
  const onSubmit = async (data) => {
    const {
      approvers,
      user,
      hierarchy,
      approverType,
      comments,
      userName
    } = data;

    console.log(errors);

    try {
      await validationSchema.validate(data);
    } catch (err) {
      console.log(err);
      throw new Error(err.errors);
    }

    const req = {
      status: 'SUBMITTED',
      commanders: approvers,
      additionalParams: {
        entityId: user.id,
        displayName: userName,
        domainUsers: (user?.digitalIdentities || []).map(({ uniqueId, mail }) => uniqueId || mail),
        akaUnit: user.akaUnit,
        personalNumber: user.personalNumber,
        identityCard: user.identityCard,
        type: approverType,
        directGroup: hierarchy,
      },
      comments,
      due: Date.now(),
    };

    await appliesStore.createNewApproverApply(req);
    setIsActionDone(true);
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
    <div className="p-fluid">
      <div className="p-fluid-item p-fluid-item-flex1">
        <div className="p-field">
          <label htmlFor="2011">
            <span className="required-field">*</span>סוג גורם מאשר
          </label>
          <Dropdown
            {...register("approverType")}
            disabled={onlyForView}
            className={`${onlyForView ? "disabled" : ""} approverType`}
            value={approverType}
            inputId="2011"
            required
            options={approverTypes}
            onChange={handleApprover}
          />
        </div>
      </div>
      <div className="p-fluid-item">
        <div className="p-field">
          <label htmlFor="2020">
            {" "}
            <span className="required-field">*</span>שם מלא
          </label>
          <button
            className="btn-underline left19 approver-fillMe"
            onClick={setCurrentUser}
            type="button"
            title="עבורי"
            style={onlyForView && { display: "none" }}
          >
            עבורי
          </button>
          <AutoComplete
            value={watch("userName")}
            suggestions={userSuggestions}
            completeMethod={onSearchUser}
            id="approverForm-userName"
            type="text"
            field="fullName"
            onSelect={(e) => {
              setValue("user", e.value);
              setValue("personalNumber", e.value.personalNumber || e.value.identityCard);
              setValue("hierarchy", e.value.hierarchy);
            }}
            onChange={(e) => {
              setValue("userName", e.value);
              if (e.value === "") {
                setValue("personalNumber", "");
                setValue("hierarchy", "");
              }
            }}
            required
            disabled={onlyForView}
          />
          {errors.user && (
            <small style={{ color: "red" }}>{errors.user?.message ? errors.user?.message : "יש למלא ערך"}</small>
          )}
        </div>
      </div>
      <div className="p-fluid-item">
        <div className="p-field">
          <label htmlFor="2021">
            {" "}
            <span className="required-field">*</span>מ"א/ת"ז
          </label>
          <InputText
            {...register("personalNumber", { required: true })}
            id="2021"
            type="text"
            required
            onBlur={onSearchUserByPersonalNumber}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchUserByPersonalNumber();
              }
            }}
            disabled={onlyForView}
          />
          {errors.user && (
            <small style={{ color: "red" }}> {errors.user?.message ? errors.user?.message : "יש למלא ערך"}</small>
          )}
        </div>
      </div>
      <div className="p-fluid-item">
        <Hierarchy
          disabled={true}
          setValue={setValue}
          name="hierarchy"
          ogValue={getValues("hierarchy")}
          errors={errors}
        />
      </div>
      <div className="p-fluid-item">
        <Approver
          disabled={onlyForView || isUserHoldType(userStore.user, USER_TYPE.COMMANDER)}
          setValue={setValue}
          name="approvers"
          defaultApprovers={GetDefaultApprovers(requestObject, onlyForView, setValue)}
          multiple={true}
          errors={errors}
        />
      </div>
      <div className="p-fluid-item p-fluid-item-flex1">
        <div className="p-field">
          <label htmlFor="2016">הערות</label>
          <InputTextarea
            disabled={onlyForView}
            {...register("comments")}
            id="2016"
            type="text"
            placeholder="הכנס הערות לבקשה..."
          />
        </div>
      </div>
    </div>
  );
});

ApproverForm.defaultProps = {
  onlyForView: undefined,
  approverRequestObj: {}
}

export default ApproverForm;

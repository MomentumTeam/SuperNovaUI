import * as Yup from "yup";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import datesUtil from "../../../utils/dates";
import { CanSeeUserClearance, getSamAccountName } from "../../../utils/entites";
import { NAME_OG_EXP, PHONE_REG_EXP, USER_CLEARANCE } from "../../../constants";
import { InputForm, InputTypes } from "../../Fields/InputForm";
import { useStores } from "../../../context/use-stores";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";

import { ListBox } from "primereact/listbox";
import { Button } from 'primereact/button';


const validationSchema = Yup.object().shape({
  firstName: Yup.string().matches(NAME_OG_EXP, "שם לא תקין").required("יש לבחור שם פרטי"),
  lastName: Yup.string().matches(NAME_OG_EXP, "שם לא תקין").required("יש לבחור שם משפחה"),
  hasIdentityCard: Yup.boolean(),
  identityCard: Yup.string().when("hasIdentityCard", {
    is: true,
    then: Yup.string().required('יש להזין ת"ז'),
  }),
  phone: Yup.array().of(
    Yup.string().matches(PHONE_REG_EXP, "מספר לא תקין").required("נא להזין מספר")
  ),
  canSeeUserClearance: Yup.boolean(),
  clearance: Yup.string().when("canSeeUserClearance", {
    is: true,
    then: Yup.string().required("יש להכניס סיווג"),
  }),
});

const FullEntityInformationForm = forwardRef(({ setIsActionDone, onlyForView, requestObject, reqView = true }, ref) => {
  const { appliesStore } = useStores();
  const [user, setUser] = useState(requestObject);

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: user
  });
  const { errors } = methods.formState;

  useEffect(() => {
    if (requestObject) {
      if (reqView) {
        setUser(requestObject.kartoffelParams);
      } else {
        setUser(requestObject);
      }
    }
  }, [requestObject]);

  const onSubmit = async (data) => {
    try {
      let tempForm = { ...user, ...data };
      tempForm.fullName = `${tempForm.firstName} ${tempForm.lastName}`;

      const kartoffelParams = {
        id: tempForm.id,
        firstName: tempForm.firstName,
        lastName: tempForm.lastName,
        serviceType: tempForm.serviceType,
        address: tempForm.address || "---",
        clearance: tempForm.clearance || "unknown",
        sex: tempForm.sex,
        birthdate: tempForm.birthDate? datesUtil.getTime(tempForm.birthDate): datesUtil.getTime(new Date()),
        entityType: tempForm.entityType,
        phone: Array.isArray(tempForm.phone)? tempForm.phone: [tempForm.phone],
        ...(tempForm.personalNumber && { personalNumber: tempForm.personalNumber }),
        ...(tempForm.identityCard && { identityCard: tempForm.identityCard }),
      };

      const samAccountName = getSamAccountName(tempForm);

      await appliesStore.editEntityApply({
        kartoffelParams,
        adParams: {
          samAccountName: samAccountName,
          firstName: tempForm.firstName,
          lastName: tempForm.lastName,
          fullName: tempForm.fullName,
        },
      });
      setIsActionDone(true);
    } catch (error) {
      console.log(error);
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      handleSubmit: methods.handleSubmit(onSubmit),
    }),
    []
  );


  const formFields = [
    {
      fieldName: "id",
      displayName: "מזהה",
      inputType: InputTypes.TEXT,
      force: true,
      secured: () => reqView,
    },
    {
      fieldName: "firstName",
      displayName: "שם פרטי",
      inputType: InputTypes.TEXT,
      canEdit: true,
      force: true,
    },
    {
      fieldName: "lastName",
      displayName: "שם משפחה",
      inputType: InputTypes.TEXT,
      canEdit: true,
      force: true,
    },
    {
      fieldName: "personalNumber",
      displayName: 'מ"א',
      inputType: InputTypes.TEXT,
      secured: () => !reqView,
    },
    {
      fieldName: "identityCard",
      displayName: 'ת"ז',
      inputType: InputTypes.TEXT,
      type: "num",
      keyFilter: "num",
      canEdit: true,
    },
    {
      fieldName: "rank",
      displayName: "דרגה",
      inputType: InputTypes.TEXT,
      secured: () => !reqView,
    },
    {
      fieldName: "hierarchy",
      displayName: "היררכיה",
      inputType: InputTypes.TEXT,
      force: true,
      secured: () => !reqView,
    },
    {
      fieldName: "mail",
      displayName: "מייל",
      inputType: InputTypes.TEXT,
      force: true,
    },
    {
      fieldName: "jobTitle",
      displayName: "תפקיד",
      inputType: InputTypes.TEXT,
      force: true,
      secured: () => !reqView,
    },
    {
      fieldName: "address",
      displayName: "כתובת",
      inputType: InputTypes.TEXT,
      secured: () => !reqView,
    },
    {
      fieldName: "phone",
      displayName: "טלפון",
      inputType: InputTypes.TEXT,
      type: "num",
      keyFilter: "num",
      canEdit: true,
      force: true,
    },
    {
      fieldName: "birthDate",
      displayName: "תאריך לידה",
      inputType: InputTypes.CALANDER,
      secured: () => !reqView,
    },
    {
      fieldName: "dischargeDay",
      displayName: 'תק"ש',
      inputType: InputTypes.CALANDER,
      secured: () => !reqView,
    },
    {
      fieldName: "clearance",
      displayName: "סיווג",
      inputType: InputTypes.DROPDOWN,
      canEdit: true,
      options: USER_CLEARANCE,
      secured: CanSeeUserClearance,
      force: true,
    },
  ];

  const itemTemplate = (option) => {
    return (
      <div className="flex-container">
        <div className="flex-child " style={{width:'100px'}}>{option}</div>
        <Button icon="pi pi-times" className="p-button-rounded p-button-danger flex-child " />
      </div>
    );

  }
  return (
    <div className="p-fluid">
      <InputForm fields={formFields} item={user} isEdit={!onlyForView} errors={errors} methods={methods} />

      {/* <div className="p-fluid-item ">
        <div className="p-field">
      <ListBox className="listbox-item" options={["0502388143", "0773006188"]} itemTemplate={itemTemplate}/>
        </div>
      </div> */}
    </div>
  );
});

export { FullEntityInformationForm };
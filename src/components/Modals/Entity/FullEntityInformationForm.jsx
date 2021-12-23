import * as Yup from "yup";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import datesUtil from "../../../utils/dates";
import { CanSeeUserClearance, CanEditEntityFields } from "../../../utils/entites";
import { NAME_REG_EXP, PHONE_REG_EXP } from "../../../constants";
import { InputForm, InputTypes } from "../../Fields/InputForm";
import { useStores } from "../../../context/use-stores";

import "../../../assets/css/local/general/buttons.css";
import "../../../assets/css/local/components/modal-item.css";
import { getSamAccountNameFromEntity } from '../../../utils/fields';


const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("יש לבחור שם פרטי").matches(NAME_REG_EXP, "שם לא תקין"),
  lastName: Yup.string().required("יש לבחור שם משפחה").matches(NAME_REG_EXP, "שם לא תקין"),
  hasIdentityCard: Yup.boolean(),
  identityCard: Yup.string().when("hasIdentityCard", {
    is: true,
    then: Yup.string().required('יש להזין ת"ז'),
  }),
  mobilePhone: Yup.array().of(Yup.string().matches(PHONE_REG_EXP, "מספר לא תקין").required("נא להזין מספר")),
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
        phone: Array.isArray(tempForm.mobilePhone) ? tempForm.mobilePhone : [tempForm.mobilePhone],
        ...(tempForm.serviceType && { serviceType: tempForm.serviceType }),
        ...(tempForm.address && { address: tempForm.address }),
        ...(tempForm.clearance && { clearance: tempForm.clearance }),
        ...(tempForm && { sex: tempForm.sex }),
        ...(tempForm.birthDate && { birthdate: datesUtil.getTime(tempForm.birthDate) }),
        ...(tempForm.entityType && { entityType: tempForm.entityType }),
        ...(tempForm.personalNumber && { personalNumber: tempForm.personalNumber }),
        ...(tempForm.identityCard && { identityCard: tempForm.identityCard }),
      };

      const samAccountName = getSamAccountNameFromEntity(tempForm);

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
      canEdit: () => CanEditEntityFields(user),
      force: true,
    },
    {
      fieldName: "lastName",
      displayName: "שם משפחה",
      inputType: InputTypes.TEXT,
      canEdit: () => CanEditEntityFields(user),
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
      canEdit: () => CanEditEntityFields(user),
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
      fieldName: "mobilePhone",
      displayName: "טלפון",
      inputType: InputTypes.LISTBOX,
      type: "num",
      keyFilter: "num",
      canEdit: () => CanEditEntityFields(user),
      force: true,
      validator: (value) => PHONE_REG_EXP.test(value),
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
      canEdit: true,
      secured: CanSeeUserClearance,
      force: true,
      inputType: InputTypes.TEXT,
      type: "num",
      keyFilter: "num",
    },
  ];


  return (
    <div className="p-fluid">
      <InputForm fields={formFields} item={user} isEdit={!onlyForView} errors={errors} methods={methods} />
    </div>
  );
});

export { FullEntityInformationForm };

import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useStores } from '../../../context/use-stores';
import {
  NAME_REG_EXP,
  PHONE_REG_EXP,
  USER_CLEARANCE,
  USER_TYPE,
  USER_SEX,
  USER_CITIZEN_ENTITY_TYPE,
  IDENTITY_CARD_EXP,
} from "../../../constants";
import { GetDefaultApprovers } from '../../../utils/approver';
import { isUserHoldType } from '../../../utils/user';
import { InputForm, InputTypes } from '../../Fields/InputForm';
import datesUtil from "../../../utils/dates";


const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("יש למלא שם פרטי").matches(NAME_REG_EXP, "שם לא תקין"),
  lastName: Yup.string().required("יש למלא שם משפחה").matches(NAME_REG_EXP, "שם לא תקין"),
  identityNumber: Yup.string().required('יש להזין ת"ז').matches(IDENTITY_CARD_EXP, 'ת"ז לא תקין'),
  mobilePhone: Yup.string().required("יש למלא מספר פלאפון נייד").matches(PHONE_REG_EXP, "מספר לא תקין"),
  classification: Yup.string().required("יש לבחור סיווג"),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when("isUserApprover", {
    is: false,
    then: Yup.array().min(1, "יש לבחור לפחות גורם מאשר אחד").required("יש לבחור לפחות גורם מאשר אחד"),
  }),
  comments: Yup.string().optional(),
  sex: Yup.string().optional().nullable(),
});

const CreateSpecialEntityForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore} = useStores();
    const isUserApprover = isUserHoldType(userStore.user, USER_TYPE.COMMANDER);
    const [defaultApprovers, setDefaultApprovers] = useState([]);

    const methods = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover },
    });
    const { errors } = methods.formState;

    useEffect(async() => {
      if (requestObject) {
        methods.setValue("comments", requestObject.comments);
        methods.setValue("firstName", requestObject.kartoffelParams.firstName);
        methods.setValue("lastName", requestObject.kartoffelParams.lastName);
        methods.setValue("identityNumber", requestObject.kartoffelParams.identityCard);
        methods.setValue("mobilePhone", requestObject.kartoffelParams.mobilePhone[0]);
        methods.setValue("classification", requestObject.kartoffelParams.clearance);
        methods.setValue("sex", requestObject.kartoffelParams.sex);
        methods.setValue(
          "birthdate",
          requestObject.kartoffelParams?.birthdate ? parseInt(requestObject.kartoffelParams.birthdate) : ""
        );

      }

      const result = await GetDefaultApprovers({ request: requestObject, onlyForView, user: userStore.user });
      setDefaultApprovers(result || []);
    }, []);

    const onSubmit = async (data) => {
      try {
        await validationSchema.validate(data);
      } catch (err) {
        throw new Error(err.errors);
      }

      const {
        firstName,
        lastName,
        identityNumber,
        mobilePhone,
        classification,
        comments,
        sex,
        approvers,
        birthdate
      } = data;

      const req = {
        commanders: approvers,
        kartoffelParams: {
          firstName,
          lastName,
          identityCard: identityNumber,
          mobilePhone: [mobilePhone],
          phone: [mobilePhone],
          clearance: classification,
          entityType: USER_CITIZEN_ENTITY_TYPE,
          ...(sex && sex !== "" && { sex }),
          ...(birthdate && { birthdate: datesUtil.getTime(birthdate) }),
        },
        comments,
        adParams: {},
      };

      await appliesStore.createEntityApply(req);
      await setIsActionDone(true);
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
        fieldName: "identityNumber",
        displayName: 'ת"ז',
        inputType: InputTypes.TEXT,
        type: "num",
        keyFilter: "num",
        canEdit: true,
        force: true,
      },
      {
        fieldName: "mobilePhone",
        displayName: "פלאפון נייד",
        inputType: InputTypes.TEXT,
        type: "num",
        keyFilter: "num",
        canEdit: true,
        force: true,
      },
      {
        fieldName: "classification",
        displayName: "סיווג המשתמש",
        inputType: InputTypes.DROPDOWN,
        canEdit: true,
        options: USER_CLEARANCE,
        force: true,
      },
      {
        fieldName: "sex",
        displayName: "מגדר",
        inputType: InputTypes.DROPDOWN,
        canEdit: true,
        options: USER_SEX,
        force: true,
        required: false,
      },
      {
        fieldName: "birthdate",
        displayName: "תאריך לידה",
        inputType: InputTypes.CALANDER,
        canEdit: true,
        force: true,
        required: false,
      },
      {
        fieldName: "approvers",
        inputType: InputTypes.APPROVER,
        tooltip: 'רס"ן ומעלה ביחידתך',
        default: defaultApprovers,
        disabled: onlyForView || methods.watch("isUserApprover"),
        force: true,
      },
      {
        fieldName: "comments",
        displayName: "הערות",
        inputType: InputTypes.TEXTAREA,
        force: true,
        placeholder: "הכנס הערות לבקשה...",
        additionalClass: "p-fluid-item-flex1",
        canEdit: true,
      },
    ];
    return (
      <div className="p-fluid">
        <InputForm fields={formFields} errors={errors} item={requestObject} isEdit={!onlyForView} methods={methods}/>
      </div>
    );
});

export default CreateSpecialEntityForm;

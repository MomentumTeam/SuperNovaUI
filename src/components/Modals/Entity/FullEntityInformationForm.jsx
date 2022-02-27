import * as Yup from 'yup';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import datesUtil from '../../../utils/dates';
import {
  CanSeeUserClearance,
  CanEditEntityFields,
} from '../../../utils/entites';
import { IDENTITY_CARD_EXP, NAME_REG_EXP, PHONE_REG_EXP } from '../../../constants';
import { InputForm, InputTypes } from '../../Fields/InputForm';
import { useStores } from '../../../context/use-stores';

import '../../../assets/css/local/general/buttons.css';
import '../../../assets/css/local/components/modal-item.css';
import { getSamAccountNameFromEntity } from '../../../utils/fields';
import { kartoffelIdentityCardValidation } from '../../../utils/user';

const validationSchema = Yup.object().shape({
  canEditEntityFields: Yup.boolean(),
  firstName: Yup.string().when("canEditEntityFields", {
    is: true,
    then: Yup.string().required("יש לבחור שם פרטי").matches(NAME_REG_EXP, "שם לא תקין"),
  }),
  lastName: Yup.string().when("canEditEntityFields", {
    is: true,
    then: Yup.string().required("יש לבחור שם משפחה").matches(NAME_REG_EXP, "שם לא תקין"),
  }),
  identityCard: Yup.string().when("canEditEntityFields", {
    is: true,
    then: Yup.string().required('יש להזין ת"ז')
    .matches(IDENTITY_CARD_EXP, 'ת"ז לא תקין')
    .test({
      name: 'check-if-valid',
      message: 'ת"ז לא תקין!',
      test: async (identityNumber) => {
        return kartoffelIdentityCardValidation(identityNumber);
      },
    }),
  }),
  mobilePhone: Yup.mixed().when("canEditEntityFields", {
    is: true,
    then: Yup.string('נא להזין מספר').required("נא להזין מספר").matches(PHONE_REG_EXP, "מספר לא תקין"),
  }),
  canSeeUserClearance: Yup.boolean(),
  clearance: Yup.string().when("canSeeUserClearance", {
    is: true,
    then: Yup.string().required("יש להכניס סיווג"),
  }),
});

const FullEntityInformationForm = forwardRef(
  (
    { setIsActionDone, onlyForView, requestObject, reqView = true, setIsEdit },
    ref
  ) => {
    const { appliesStore, configStore } = useStores();
    const [user, setUser] = useState(requestObject);
    const methods = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        ...user,
        canEditEntityFields: CanEditEntityFields(user),
        canSeeUserClearance: CanSeeUserClearance(),
      },
    });
    const { errors } = methods.formState;

    useEffect(() => {
      if (requestObject) {
        if (reqView) {
          if (
            Array.isArray(requestObject.kartoffelParams?.mobilePhone) &&
            requestObject.kartoffelParams?.mobilePhone.length === 0
          ) {
            if (
              Array.isArray(requestObject.kartoffelParams.phone) &&
              requestObject.kartoffelParams.phone.length > 0
            ) {
              requestObject.kartoffelParams.mobilePhone =
                requestObject.kartoffelParams.phone[0];
            }
          }

          requestObject.kartoffelParams.samAccountName =
            requestObject.adParams.samAccountName;
          setUser(requestObject.kartoffelParams);
        } else {
          if (!requestObject?.mobilePhone) {
            if (
              requestObject.phone &&
              Array.isArray(requestObject.phone) &&
              requestObject.phone.length > 0
            ) {
              requestObject.mobilePhone = requestObject.phone[0];
            } else {
              requestObject.mobilePhone = '';
            }
          }
          if (Array.isArray(requestObject.mobilePhone))
            requestObject.mobilePhone = requestObject.mobilePhone[0];
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
          phone: !tempForm?.mobilePhone
            ? []
            : Array.isArray(tempForm.mobilePhone)
            ? tempForm.mobilePhone
            : [tempForm.mobilePhone],
          ...(tempForm.serviceType && { serviceType: tempForm.serviceType }),
          ...(tempForm.address && { address: tempForm.address }),
          ...(tempForm.clearance && { clearance: tempForm.clearance }),
          ...(tempForm.sex && { sex: tempForm.sex }),
          ...(tempForm.birthDate && {
            birthdate: datesUtil.getTime(tempForm.birthDate),
          }),
          ...(tempForm.entityType && { entityType: tempForm.entityType }),
          ...(tempForm.personalNumber && {
            personalNumber: tempForm.personalNumber,
          }),
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
        setIsEdit(false);
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
        fieldName: 'id',
        displayName: 'מזהה',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => reqView,
      },
      {
        fieldName: 'samAccountName',
        displayName: 'מזהה משתמש',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => reqView,
      },
      {
        fieldName: 'firstName',
        displayName: 'שם פרטי',
        inputType: InputTypes.TEXT,
        canEdit: methods.watch('canEditEntityFields'),
        force: true,
      },
      {
        fieldName: 'lastName',
        displayName: 'שם משפחה',
        inputType: InputTypes.TEXT,
        canEdit: methods.watch('canEditEntityFields'),
        force: true,
      },
      {
        fieldName: 'personalNumber',
        displayName: 'מ"א',
        inputType: InputTypes.TEXT,
        secured: () => !reqView,
      },
      {
        fieldName: 'identityCard',
        displayName: 'ת"ז',
        inputType: InputTypes.TEXT,
        type: 'num',
        keyFilter: 'num',
        canEdit: methods.watch('canEditEntityFields'),
      },
      {
        fieldName: 'rank',
        displayName: 'דרגה',
        inputType: InputTypes.TEXT,
        secured: () => !reqView,
      },
      {
        fieldName: 'hierarchy',
        displayName: 'היררכיה',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => !reqView,
        withTooltip: true,
      },
      {
        fieldName: 'mail',
        displayName: 'מייל',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => !reqView,
      },
      {
        fieldName: 'jobTitle',
        displayName: 'תפקיד',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => !reqView,
      },
      {
        fieldName: 'address',
        displayName: 'כתובת',
        inputType: InputTypes.TEXT,
        secured: () => !reqView,
      },
      {
        fieldName: 'mobilePhone',
        displayName: 'פלאפון נייד',
        inputType: InputTypes.TEXT,
        type: 'num',
        keyFilter: 'num',
        canEdit: methods.watch('canEditEntityFields'),
        force: true,
      },
      {
        fieldName: 'birthDate',
        displayName: 'תאריך לידה',
        inputType: InputTypes.CALANDER,
        secured: () => !reqView,
        untilNow: true,
      },
      {
        fieldName: 'dischargeDay',
        displayName: 'תק"ש',
        inputType: InputTypes.CALANDER,
        secured: () => !reqView,
      },
      {
        fieldName: 'clearance',
        displayName: 'סיווג',
        canEdit: true,
        secured: () => methods.watch('canSeeUserClearance'),
        force: true,
        inputType: InputTypes.TEXT,
        type: 'num',
        keyFilter: 'num',
      },
      {
        fieldName: 'organization',
        displayName: 'ארגון',
        inputType: InputTypes.TEXT,
        type: 'string',
        keyFilter: 'string',
        secured: () => user.entityType === configStore.KARTOFFEL_EXTERNAL,
        canEdit: false,
        force: true,
      },
      {
        fieldName: 'employeeNumber',
        displayName: 'מספר עובד',
        inputType: InputTypes.TEXT,
        type: 'string',
        keyFilter: 'string',
        secured: () => user.entityType === configStore.KARTOFFEL_EXTERNAL,
        canEdit: false,
        force: true,
      }
    ];

    return (
      <div className="p-fluid" id="fullEntityInfoForm">
        <InputForm
          fields={formFields}
          item={user}
          isEdit={!onlyForView}
          errors={errors}
          methods={methods}
        />
      </div>
    );
  }
);

export { FullEntityInformationForm };

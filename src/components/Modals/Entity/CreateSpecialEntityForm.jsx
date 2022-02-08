import React, {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useStores } from '../../../context/use-stores';
import {
  NAME_REG_EXP,
  PHONE_REG_EXP,
  USER_TYPE,
  USER_SEX,
  IDENTITY_CARD_EXP,
} from '../../../constants';
import { GetDefaultApprovers } from '../../../utils/approver';
import { isUserApproverType, isUserHoldType } from '../../../utils/user';
import { InputForm, InputTypes } from '../../Fields/InputForm';
import datesUtil from '../../../utils/dates';
import { kartoffelIdentityCardValidation } from '../../../utils/user';
import { RadioButton } from 'primereact/radiobutton';
import { getEntityByIdentifier } from '../../../service/KartoffelService';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('יש למלא שם פרטי')
    .matches(NAME_REG_EXP, 'שם לא תקין'),
  lastName: Yup.string()
    .required('יש למלא שם משפחה')
    .matches(NAME_REG_EXP, 'שם לא תקין'),
  identityNumber: Yup.string()
    .required('יש להזין ת"ז')
    .matches(IDENTITY_CARD_EXP, 'ת"ז לא תקין')
    .test({
      name: 'check-if-valid',
      message: 'ת"ז לא תקין!',
      test: async (identityNumber) => {
        return kartoffelIdentityCardValidation(identityNumber);
      },
    })
    .test({
      name: 'check-if-identity-number-already-taken-in-kartoffel',
      message: 'קיים משתמש עם הת"ז הזה!',
      test: async (identityNumber) => {
        try {
          const isAlreadyTaken = await getEntityByIdentifier(
            identityNumber
          );

          if (isAlreadyTaken) {
            return false;
          }
        } catch (err) {}

        return true;
      },
    }),
  mobilePhone: Yup.string()
    .required('יש למלא מספר פלאפון נייד')
    .matches(PHONE_REG_EXP, 'מספר לא תקין'),
  classification: Yup.string().required('יש לבחור סיווג'),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when('isUserApprover', {
    is: false,
    then: Yup.array()
      .min(1, 'יש לבחור לפחות גורם מאשר אחד')
      .required('יש לבחור לפחות גורם מאשר אחד'),
  }),
  comments: Yup.string().optional(),
  sex: Yup.string().optional().nullable(),
});

const CreateSpecialEntityForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore, configStore } = useStores();
    const isUserApprover = isUserApproverType(userStore.user);
    const [defaultApprovers, setDefaultApprovers] = useState([]);
    const userTypes = [
      { name: 'אזרח', key: configStore.KARTOFFEL_CIVILIAN },
      { name: 'חייל ', key: configStore.KARTOFFEL_SOLDIER },
      { name: 'עובד', key: configStore.KARTOFFEL_WORKER },
    ];
    const [selectedUserType, setSelectedUserType] = useState(userTypes[0]);

    const methods = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: { isUserApprover },
    });
    const { errors } = methods.formState;

    useEffect(async () => {
      console.log()
      if (requestObject) {
        methods.setValue('comments', requestObject.comments);
        methods.setValue('firstName', requestObject.kartoffelParams.firstName);
        methods.setValue('lastName', requestObject.kartoffelParams.lastName);
        methods.setValue(
          'identityNumber',
          requestObject.kartoffelParams.identityCard
        );
        methods.setValue(
          'mobilePhone',
          requestObject.kartoffelParams.mobilePhone[0]
        );
        methods.setValue(
          'classification',
          requestObject.kartoffelParams.clearance
        );
        methods.setValue('sex', requestObject.kartoffelParams.sex);
        methods.setValue(
          'birthdate',
          requestObject.kartoffelParams?.birthdate
            ? parseInt(requestObject.kartoffelParams.birthdate)
            : ''
        );
      }

      const result = await GetDefaultApprovers({
        request: requestObject,
        onlyForView,
        user: userStore.user,
      });
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
        birthdate,
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
          entityType: selectedUserType.key == 'WORKER' ? configStore.USER_EXTERNAL_ENTITY_TYPE : configStore.USER_CITIZEN_ENTITY_TYPE,
          ...(sex && sex !== '' && { sex }),
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

    const anonUserFormFields = [
      {
        fieldName: "unitId",
        displayName: "מזהה יחידה",
        inputType: InputTypes.DROPDOWN,
        type: "num",
        keyFilter: "num",
        canEdit: true,
        force: true,
      },
      {
        fieldName: "employeeId",
        displayName: "מספר עובד",
        inputType: InputTypes.TEXT,
        type: "num",
        keyFilter: "num",
        canEdit: true,
        force: true,
      }
    ]

    const civilianUserFormFields = [
      {
        fieldName: "identityNumber",
        displayName: 'ת"ז',
        inputType: InputTypes.TEXT,
        type: "num",
        keyFilter: "num",
        canEdit: true,
        force: true,
      }
    ]

    const soldierUserFormFields = [
      {
        fieldName: 'identityNumber',
        displayName: 'ת"ז',
        inputType: InputTypes.TEXT,
        type: 'num',
        keyFilter: 'num',
        canEdit: true,
        force: true,
      },
      {
        fieldName: 'serviceType',
        displayName: 'סוג שירות ',
        inputType: InputTypes.DROPDOWN,
        canEdit: true,
        options: configStore.KARTOFFEL_SERVICE_TYPES,
        force: true,
      },
      {
        fieldName: 'rank',
        displayName: 'דרגה ',
        inputType: InputTypes.DROPDOWN,
        canEdit: true,
        options: configStore.KARTOFFEL_RANKS,
        force: true,
      },
    ];

    let fields = civilianUserFormFields;
    console.log(selectedUserType)
    switch (selectedUserType.key) {
      case configStore.KARTOFFEL_CIVILIAN:
        fields = civilianUserFormFields;
        break;
      case configStore.KARTOFFEL_WORKER:
        fields = anonUserFormFields;
        break;
      case configStore.KARTOFFEL_SOLDIER:
        fields = soldierUserFormFields; 
        break;
    }
    console.log(fields)
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
      ...fields,
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
        options: configStore.USER_CLEARANCE,
        force: true,
        additionalClass: 'dropDownInput',
      },
      {
        fieldName: "sex",
        displayName: "מגדר",
        inputType: InputTypes.DROPDOWN,
        canEdit: true,
        options: USER_SEX,
        force: true,
        required: false,
        additionalClass: 'dropDownInput',
      },
      {
        fieldName: "birthdate",
        displayName: "תאריך לידה",
        inputType: InputTypes.CALANDER,
        canEdit: true,
        force: true,
        required: false,
        untilNow: true,
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
        placeholder: !onlyForView && "הכנס הערות לבקשה...",
        additionalClass: "p-fluid-item-flex1",
        canEdit: true,
      },
    ];
    return (
      <div>
        <div className='userTypePick' style={{ display: 'inline-flex' }}>
          {userTypes.map((userType) => {
            return (
              <div key={userType.key} className='field-radiobutton'>
                <RadioButton
                  inputId={userType.key}
                  name='userType'
                  value={userType}
                  onChange={(e) => {
                    setSelectedUserType(e.value);
                    console.log(e.value);
                  }}
                  checked={selectedUserType.key === userType.key}
                  style={{ marginRight: '10px' }}
                />
                <label htmlFor={userType.key} style={{ padding: '5px' }}>
                  {userType.name}
                </label>
              </div>
            );
          })}
        </div>
        <div className='p-fluid' id='createSpecialEntityForm'>
          <InputForm
            fields={formFields}
            errors={errors}
            item={requestObject}
            isEdit={!onlyForView}
            methods={methods}
          />
        </div>
      </div>
    );
  }
);

export default CreateSpecialEntityForm;

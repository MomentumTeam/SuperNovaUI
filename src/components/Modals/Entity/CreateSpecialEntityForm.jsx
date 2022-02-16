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
  USER_SEX,
  IDENTITY_CARD_EXP,
} from '../../../constants';
import {
  GetDefaultApprovers,
  checkValidExternalApprover,
} from '../../../utils/approver';
import {
  isUserApproverType
} from '../../../utils/user';
import { InputForm, InputTypes } from '../../Fields/InputForm';
import datesUtil from '../../../utils/dates';
import { kartoffelIdentityCardValidation } from '../../../utils/user';
import { RadioButton } from 'primereact/radiobutton';
import { getEntityByIdentifier } from '../../../service/KartoffelService';
import { getUniqueFieldsByUserType } from '../../../utils/uniqueFormFields';

const validationSchema = Yup.object().shape({
  workerEntityType: Yup.string(),
  soldierEntityType: Yup.string(),
  firstName: Yup.string()
    .required('יש למלא שם פרטי')
    .matches(NAME_REG_EXP, 'שם לא תקין'),
  lastName: Yup.string()
    .required('יש למלא שם משפחה')
    .matches(NAME_REG_EXP, 'שם לא תקין'),
  identityNumber: Yup.string().when(['userType', 'workerEntityType'], {
    is: (userType, workerEntityType) => userType === workerEntityType,
    then: Yup.string().optional(),
    otherwise: Yup.string()
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
            const isAlreadyTaken = await getEntityByIdentifier(identityNumber);

            if (isAlreadyTaken) {
              return false;
            }
          } catch (err) { }

          return true;
        },
      }),
  }),
  mobilePhone: Yup.string().when(['userType', 'workerEntityType'], {
    is: (userType, workerEntityType) => userType === workerEntityType,
    then: Yup.string().optional(),
    otherwise: Yup.string()
      .required('יש למלא מספר פלאפון נייד')
      .matches(PHONE_REG_EXP, 'מספר לא תקין'),
  }),
  classification: Yup.string().required('יש לבחור סיווג'),
  isUserApprover: Yup.boolean(),
  approvers: Yup.array().when(
    [
      'userType',
      'workerEntityType',
      'isUserExternalApprover',
      'isUserApprover',
    ],
    {
      is: (
        userType,
        workerEntityType,
        isUserExternalApprover,
        isUserApprover
      ) =>
        (userType === workerEntityType && isUserExternalApprover === false) ||
        (userType !== workerEntityType && isUserApprover === false),
      then: Yup.array()
        .min(1, 'יש לבחור לפחות גורם מאשר אחד')
        .required('יש לבחור לפחות גורם מאשר אחד')
        .test({
          name: 'check-if-valid-approver',
          message: 'מאשר לא תקין, נא לבחור מאשר שנמצא תחת ההיררכיות המורשות',
          test: async (approvers) => {
            console.log(approvers);
          },
        }),
    }
  ),
  comments: Yup.string().optional(),
  sex: Yup.string().optional().nullable(),
  userType: Yup.string(),
  personalNumber: Yup.string().when(['userType', 'soldierEntityType'], {
    is: (userType, soldierEntityType) => userType === soldierEntityType,
    then: Yup.string().required('יש להכניס מספר אישי'),
    otherwise: Yup.string().optional(),
  }),
  serviceType: Yup.string().when(['userType', 'soldierEntityType'], {
    is: (userType, soldierEntityType) => userType === soldierEntityType,
    then: Yup.string().required('יש לבחור סוג שירות'),
    otherwise: Yup.string().optional(),
  }),
  rank: Yup.string().when(['userType', 'soldierEntityType'], {
    is: (userType, soldierEntityType) => userType === soldierEntityType,
    then: Yup.string().required('יש לבחור דרגה'),
    otherwise: Yup.string().optional(),
  }),
  employeeNumber: Yup.number().when(['userType', 'workerEntityType'], {
    is: (userType, workerEntityType) => userType === workerEntityType,
    then: Yup.number().required('יש להכניס מספר עובד'),
  }),
  organization: Yup.number().when(['userType', 'workerEntityType'], {
    is: (userType, workerEntityType) => userType === workerEntityType,
    then: Yup.number().required('יש לבחור מספר ארגון'),
  }),
});

const CreateSpecialEntityForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject }, ref) => {
    const { appliesStore, userStore, configStore } = useStores();
    const isUserApprover = isUserApproverType(userStore.user);

    const userTypes = [
      { name: 'אזרח', key: configStore.KARTOFFEL_CIVILIAN },
      { name: 'חייל ', key: configStore.KARTOFFEL_SOLDIER },
      { name: 'עובד', key: configStore.KARTOFFEL_WORKER },
    ];
    const [selectedUserType, setSelectedUserType] = useState(userTypes[0]);

    const methods = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        isUserApprover,
        userType: requestObject?.kartoffelParams?.entityType
          ? requestObject?.kartoffelParams?.entityType
          : selectedUserType.key,
      },
    });
    const { errors } = methods.formState;

    useEffect(() => {
      const setFormDataFromReqObj = (requestObject) => {
        console.log(requestObject)
        methods.setValue('soldierEntityType', configStore.KARTOFFEL_SOLDIER);
        methods.setValue('workerEntityType', configStore.KARTOFFEL_WORKER);

        if (requestObject) {
          console.log(requestObject);
          methods.setValue('userType', requestObject.kartoffelParams.entityType);
         console.log(methods.watch('userType'))
          // SOLDIER and CIVILIAN
          methods.setValue(
            'identityNumber',
            requestObject.kartoffelParams.identityCard
          );

          // general fields
          methods.setValue('comments', requestObject.comments);
          methods.setValue('firstName', requestObject.kartoffelParams.firstName);
          methods.setValue('lastName', requestObject.kartoffelParams.lastName);
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

          // SOLDIER
          methods.setValue(
            'serviceType',
            requestObject.kartoffelParams.serviceType
          );
          methods.setValue('rank', requestObject.kartoffelParams.rank);
          methods.setValue(
            'personalNumber',
            requestObject.kartoffelParams.personalNumber
          );

          // WORKER
          methods.setValue(
            'organization',
            requestObject.kartoffelParams.organization
          );
          methods.setValue(
            'employeeNumber',
            requestObject.kartoffelParams.employeeNumber
          );
        }
      }

      const setDefaultApprovers = async (requestObject, onlyForView, userStore) => {
        let approvers = []
        switch (methods.watch('userType')){
          case configStore.KARTOFFEL_SOLDIER: 
            approvers = configStore.soldierRequestsApprovers
            break;
          case configStore.KARTOFFEL_CIVILIAN: 
            approvers = await GetDefaultApprovers({
              request: requestObject,
              onlyForView,
              user: userStore.user,
            });
            break;
          case configStore.KARTOFFEL_WORKER:
            break;
          default: 
            approvers = await GetDefaultApprovers({
              request: requestObject,
              onlyForView,
              user: userStore.user,
            });;
        }
        methods.setValue('approvers', approvers)  
      }

      setFormDataFromReqObj(requestObject);
      setDefaultApprovers(requestObject, onlyForView, userStore);
    }, [selectedUserType]);


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
        rank,
        serviceType,
        personalNumber,
        organization,
        employeeNumber,
      } = data;
      console.log(data, identityNumber)
      const req = {
        commanders: approvers,
        kartoffelParams: {
          firstName,
          lastName,
          identityNumber,
          mobilePhone: [mobilePhone],
          phone: [mobilePhone],
          clearance: classification,
          entityType: methods.watch('userType'),
          ...(sex && sex !== '' && { sex }),
          ...(sex && sex !== '' && { sex }),
          ...(birthdate && { birthdate: datesUtil.getTime(birthdate) }),
          ...(rank && rank !== '' && { rank }),
          ...(serviceType && serviceType !== '' && { serviceType }),
          ...(personalNumber && personalNumber !== '' && { personalNumber }),
          ...(organization && organization !== '' && { organization }),
          ...(employeeNumber && employeeNumber !== '' && { employeeNumber }),
        },
        comments,
        adParams: {},
      };
console.log(req)
      await appliesStore.createEntityApply(req);
      await setIsActionDone(true);
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: methods.handleSubmit(onSubmit),
      }),
    );


    let fields = getUniqueFieldsByUserType(
      configStore,
      methods.watch('userType')
    );
    console.log(fields, methods.watch('userType'))
    const formFields = [
      {
        fieldName: 'firstName',
        displayName: 'שם פרטי',
        inputType: InputTypes.TEXT,
        canEdit: true,
        force: true,
      },
      {
        fieldName: 'lastName',
        displayName: 'שם משפחה',
        inputType: InputTypes.TEXT,
        canEdit: true,
        force: true,
      },
      ...fields,
      {
        fieldName: 'mobilePhone',
        displayName: 'פלאפון נייד',
        inputType: InputTypes.TEXT,
        type: 'num',
        keyFilter: 'num',
        canEdit: true,
        force: true,
      },
      {
        fieldName: 'classification',
        displayName: 'סיווג המשתמש',
        inputType: InputTypes.DROPDOWN,
        options: configStore.USER_CLEARANCE,
        canEdit: true,
        force: true,
        additionalClass: 'dropDownInput',
      },
      {
        fieldName: 'sex',
        displayName: 'מגדר',
        inputType: InputTypes.DROPDOWN,
        options: USER_SEX,
        canEdit: true,
        force: true,
        required: false,
        additionalClass: 'dropDownInput',
      },
      {
        fieldName: 'birthdate',
        displayName: 'תאריך לידה',
        inputType: InputTypes.CALANDER,
        canEdit: true,
        force: true,
        required: false,
        untilNow: true,
      },
      {
        fieldName: 'approvers',
        inputType: InputTypes.APPROVER,
        tooltip: 'רס"ן ומעלה ביחידתך',
        default: methods.watch('approvers'),
        disabled:
          onlyForView ||
          (methods.watch('userType') === configStore.KARTOFFEL_WORKER &&
            methods.watch('isUserWorkerApprover')) ||
          methods.watch('isUserApprover'),
        force: true,
      },
      {
        fieldName: 'comments',
        displayName: 'הערות',
        inputType: InputTypes.TEXTAREA,
        force: true,
        placeholder: !onlyForView && 'הכנס הערות לבקשה...',
        additionalClass: 'p-fluid-item-flex1',
        canEdit: true,
      },
    ];

    return (
      <div>
        <div className='userTypePick'>
          {userTypes.map((userType) => {
            if (
              userType.key !== configStore.KARTOFFEL_WORKER ||
              (userType.key === configStore.KARTOFFEL_WORKER &&
                userStore.isUserExternal === true)
            ) {
              return (
                <div key={userType.key} className='field-radiobutton'>
                  <RadioButton
                    inputId={userType.key}
                    name='userType'
                    value={userType}
                    onChange={(e) => {
                      setSelectedUserType(e.value);
                      methods.setValue('userType', e.value.key)
                    }}
                    checked={methods.watch('userType') === userType.key}
                    disabled={onlyForView}
                  />
                  <label htmlFor={userType.key} style={{ padding: '5px' }}>
                    {userType.name}
                  </label>
                </div>
              );
            }
            return <></>;
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

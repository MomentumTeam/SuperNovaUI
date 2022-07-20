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
  USER_TYPE,
} from '../../../constants';
import {
  GetDefaultApprovers,
  checkValidExternalApprover,
} from '../../../utils/approver';
import { isUserApproverType } from '../../../utils/user';
import { InputForm, InputTypes } from '../../Fields/InputForm';
import datesUtil from '../../../utils/dates';
import { kartoffelIdentityCardValidation } from '../../../utils/user';
import { RadioButton } from 'primereact/radiobutton';
import { getEntityByIdentifier } from '../../../service/KartoffelService';
import { getUniqueFieldsByUserType } from '../../../utils/uniqueFormFields';
import { isApproverValid } from '../../../service/ApproverService';

const validationSchema = Yup.object().shape({
  workerEntityType: Yup.string(),
  soldierEntityType: Yup.string(),
  firstName: Yup.string()
    .required('יש למלא שם פרטי')
    .matches(NAME_REG_EXP, 'שם לא תקין'),
  lastName: Yup.string()
    .required('יש למלא שם משפחה')
    .matches(NAME_REG_EXP, 'שם לא תקין'),
  identityCard: Yup.string().when(['userType', 'workerEntityType'], {
    is: (userType, workerEntityType) => userType === workerEntityType,
    then: Yup.string().optional(),
    otherwise: Yup.string()
      .required('יש להזין ת"ז')
      .matches(IDENTITY_CARD_EXP, 'ת"ז לא תקין')
      .test({
        name: 'check-if-valid',
        message: 'ת"ז לא תקין!',
        test: async (identityCard) => {
          return kartoffelIdentityCardValidation(identityCard);
        },
      })
      .test({
        name: 'check-if-identity-number-already-taken-in-kartoffel',
        message: 'קיים משתמש עם הת"ז הזה!',
        test: async (identityCard) => {
          try {
            const isAlreadyTaken = await getEntityByIdentifier(identityCard);

            if (isAlreadyTaken) {
              return false;
            }
          } catch (err) {}

          return true;
        },
      }),
  }),
  mobilePhone: Yup.string().when(['userType', 'workerEntityType'], {
    is: (userType, workerEntityType) => userType === workerEntityType,
    then: Yup.string().optional(),
    otherwise: Yup.string()
      .required('יש למלא מספר טלפון נייד')
      .matches(PHONE_REG_EXP, 'מספר לא תקין'),
  }),
  classification: Yup.string().required('יש לבחור סיווג'),
  isUserApprover: Yup.boolean(),
  isUserExternalApprover: Yup.boolean(),
  approvers: Yup.array().when(
    [
      'isUserApprover',
      'isUserExternalApprover',
      'userType',
      'workerEntityType',
    ],
    {
      is: (
        isUserApprover,
        isUserExternalApprover,
        userType,
        workerEntityType
      ) => {
        return (
          userType === workerEntityType && isUserExternalApprover === false
        );
      },
      then: Yup.array()
        .min(1, 'יש לבחור לפחות גורם מאשר אחד')
        .required('יש לבחור לפחות גורם מאשר אחד')
        .test({
          name: 'check-if-valid-approver',
          message: 'מאשר לא תקין, נא לבחור מאשר שנמצא תחת ההיררכיות המורשות',
          test: async function (approvers, context) {
            let isTotalValid = true;
            await Promise.all(
              approvers.map(async (approver) => {
                if (
                  context.parent.organization &&
                  (!approver?.types ||
                    !approver?.types.includes(USER_TYPE.SECURITY) ||
                    !approver?.types.includes(USER_TYPE.SUPER_SECURITY))
                ) {
                  const { isValid } = await isApproverValid(
                    approver?.entityId || approver?.id,
                    context.parent.organization?.orgId,
                    true
                  );

                  if (!isValid) isTotalValid = false;
                }
              })
            );
            return isTotalValid;
          },
        }),
      otherwise: Yup.array().when('isUserApprover', {
        is: false,
        then: Yup.array()
          .min(1, 'יש לבחור לפחות גורם מאשר אחד')
          .required('יש לבחור לפחות גורם מאשר אחד'),
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
  employeeNumber: Yup.string().when(['userType', 'workerEntityType'], {
    is: (userType, workerEntityType) => userType === workerEntityType,
    then: Yup.string().required('יש להכניס מספר עובד'),
  }),
  organization: Yup.object().when(['userType', 'workerEntityType'], {
    is: (userType, workerEntityType) => userType === workerEntityType,
    then: Yup.object().required('יש לבחור ארגון'),
  }),
});

const CreateSpecialEntityForm = forwardRef(
  ({ setIsActionDone, onlyForView, requestObject, sendTrack }, ref) => {
    const { appliesStore, userStore, configStore } = useStores();
    const isUserApprover = isUserApproverType(userStore.user);
    const isUserExternalApprover =
      isUserApproverType(userStore.user) && userStore.isUserExternal;

    const userTypes = [
      { name: 'אזרח', key: configStore.KARTOFFEL_CIVILIAN },
      { name: 'חייל ', key: configStore.KARTOFFEL_SOLDIER },
      { name: 'עובד', key: configStore.KARTOFFEL_EXTERNAL },
    ];
    const [selectedUserType, setSelectedUserType] = useState(userTypes[0]);

    const methods = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        isUserApprover,
        isUserExternalApprover,
        userType: requestObject?.kartoffelParams?.entityType
          ? requestObject?.kartoffelParams?.entityType
          : selectedUserType.key,
      },
    });
    const { errors } = methods.formState;

    useEffect(() => {
      const setFormDataFromReqObj = (requestObject) => {
        methods.setValue('soldierEntityType', configStore.KARTOFFEL_SOLDIER);
        methods.setValue('workerEntityType', configStore.KARTOFFEL_EXTERNAL);

        if (requestObject) {
          methods.setValue(
            'userType',
            requestObject.kartoffelParams.entityType
          );

          // SOLDIER and CIVILIAN
          methods.setValue(
            'identityCard',
            requestObject.kartoffelParams.identityCard
          );

          // general fields
          methods.setValue('comments', requestObject.comments);
          methods.setValue(
            'firstName',
            requestObject.kartoffelParams.firstName
          );
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
            configStore.organizationNumberToGroupId.find((org) => {
              return (
                org.orgNumber === requestObject.kartoffelParams.organization
              );
            })
          );
          methods.setValue(
            'employeeNumber',
            requestObject.kartoffelParams.employeeNumber
          );
          methods.setValue('approvers', requestObject.commanders);
        }
      };

      const setDefaultApprovers = async (
        requestObject,
        onlyForView,
        userStore
      ) => {
        if (!onlyForView) {
          let approvers = [];
          switch (methods.watch('userType')) {
            case configStore.KARTOFFEL_SOLDIER:
              approvers = configStore.soldierRequestsApprovers;
              break;
            case configStore.KARTOFFEL_CIVILIAN:
              approvers = await GetDefaultApprovers({
                request: requestObject,
                onlyForView,
                user: userStore.user,
              });
              break;
            case configStore.KARTOFFEL_EXTERNAL:
              approvers = await checkValidExternalApprover({
                request: requestObject,
                user: userStore.user,
                isExternalUser: userStore.isUserExternal,
              });
              break;
            default:
              approvers = await GetDefaultApprovers({
                request: requestObject,
                onlyForView,
                user: userStore.user,
              });
          }
          methods.setValue('approvers', approvers);
        }
      };

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
        mobilePhone,
        classification,
        comments,
        sex,
        approvers,
        birthdate,
        identityCard,
        rank,
        serviceType,
        personalNumber,
        organization,
        employeeNumber,
      } = data;

      const req = {
        commanders: approvers,
        kartoffelParams: {
          firstName,
          lastName,
          mobilePhone: [mobilePhone],
          clearance: classification,
          entityType: methods.watch('userType'),
          ...(sex && sex !== '' && { sex }),
          ...(birthdate && { birthdate: datesUtil.getTime(birthdate) }),
        },
        comments,
        adParams: {},
      };

      switch (methods.watch('userType')) {
        case configStore.KARTOFFEL_CIVILIAN:
          req.kartoffelParams.identityCard = identityCard;
          break;
        case configStore.KARTOFFEL_SOLDIER:
          req.kartoffelParams.identityCard = identityCard;
          req.kartoffelParams.rank = rank;
          req.kartoffelParams.serviceType = serviceType;
          req.kartoffelParams.personalNumber = personalNumber;
          break;
        case configStore.KARTOFFEL_EXTERNAL:
          req.kartoffelParams.organization = organization.orgNumber;
          req.kartoffelParams.employeeNumber = employeeNumber;
          break;
        default:
          break;
      }

      await appliesStore.createEntityApply(req);
      sendTrack('יצירת', 'משתמש מיוחד');
      await setIsActionDone(true);
    };

    useImperativeHandle(ref, () => ({
      handleSubmit: methods.handleSubmit(onSubmit),
    }));

    const shouldApproversBeDisabled = (onlyForView) => {
      if (onlyForView) return true;

      let disabled = false;
      switch (methods.watch('userType')) {
        case configStore.KARTOFFEL_SOLDIER:
          disabled = true;
          break;
        case configStore.KARTOFFEL_EXTERNAL:
          if (isUserExternalApprover) disabled = true;
          break;
        case configStore.KARTOFFEL_CIVILIAN:
          if (isUserApprover) disabled = true;
          break;
        default:
          disabled = false;
      }

      return disabled;
    };

    let fields = getUniqueFieldsByUserType(
      configStore,
      methods.watch('userType')
    );
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
        displayName: 'טלפון נייד',
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
        disabled: shouldApproversBeDisabled(onlyForView),
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
        <div className="userTypePick">
          {userTypes.map((userType) => {
            if (
              userType.key !== configStore.KARTOFFEL_EXTERNAL ||
              (userType.key === configStore.KARTOFFEL_EXTERNAL &&
                userStore.isUserExternal === true)
            ) {
              return (
                <div key={userType.key} className="field-radiobutton">
                  <RadioButton
                    inputId={userType.key}
                    name="userType"
                    value={userType}
                    onChange={(e) => {
                      setSelectedUserType(e.value);
                      methods.setValue('userType', e.value.key);
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
        <div className="p-fluid" id="createSpecialEntityForm">
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

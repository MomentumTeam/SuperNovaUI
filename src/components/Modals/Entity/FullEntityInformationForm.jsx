import * as Yup from 'yup';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import '../../../assets/css/local/general/buttons.css';
import '../../../assets/css/local/components/modal-item.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import datesUtil from '../../../utils/dates';
import { InputForm, InputTypes } from '../../Fields/InputForm';
import { useStores } from '../../../context/use-stores';
import {
  getSamAccountNameFromEntity,
  getUserRelevantIdentity,
} from '../../../utils/fields';
import { kartoffelIdentityCardValidation } from '../../../utils/user';
import {
  getEntityByMongoId,
  getRoleByRoleId,
} from '../../../service/KartoffelService';
import { USER_ENTITY_TYPE } from '../../../constants/user';
import {
  CanSeeUserFullClearance,
  CanEditEntityFields,
} from '../../../utils/entites';
import {
  IDENTITY_CARD_EXP,
  NAME_REG_EXP,
  PHONE_REG_EXP,
  REQ_TYPES,
} from '../../../constants';

const validationSchema = Yup.object().shape({
  canEditEntityFields: Yup.boolean(),
  firstName: Yup.string().when('canEditEntityFields', {
    is: true,
    then: Yup.string()
      .required('יש לבחור שם פרטי')
      .matches(NAME_REG_EXP, 'שם לא תקין'),
  }),
  lastName: Yup.string().when('canEditEntityFields', {
    is: true,
    then: Yup.string()
      .required('יש לבחור שם משפחה')
      .matches(NAME_REG_EXP, 'שם לא תקין'),
  }),
  identityCard: Yup.string().when('canEditEntityFields', {
    is: true,
    then: Yup.string()
      .required('יש להזין ת"ז')
      .matches(IDENTITY_CARD_EXP, 'ת"ז לא תקין')
      .test({
        name: 'check-if-valid',
        message: 'ת"ז לא תקין!',
        test: async (identityNumber) => {
          return kartoffelIdentityCardValidation(identityNumber);
        },
      }),
  }),
  mobilePhone: Yup.mixed().when('canEditEntityFields', {
    is: true,
    then: Yup.string('נא להזין מספר')
      .required('נא להזין מספר')
      .matches(PHONE_REG_EXP, 'מספר לא תקין'),
  }),
  canSeeUserFullClearance: Yup.boolean(),
  clearance: Yup.string().when('canSeeUserFullClearance', {
    is: true,
    then: Yup.string().required('יש להכניס סיווג'),
  }),
});

const FullEntityInformationForm = forwardRef(
  (
    { setIsActionDone, onlyForView, requestObject, reqView = true, setIsEdit },

    ref
  ) => {
    const { appliesStore, configStore } = useStores();
    const [user, setUser] = useState(requestObject);
    const [role, setRole] = useState(null);
    const methods = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        ...user,
        canEditEntityFields: CanEditEntityFields(user),
        canSeeUserFullClearance: CanSeeUserFullClearance(),
      },
    });
    const { errors } = methods.formState;

    useEffect(async () => {
      if (requestObject) {
        console.log(requestObject)
        if (reqView) {
          if (requestObject.type === REQ_TYPES.CONVERT_ENTITY_TYPE) {
            const entity = await getEntityByMongoId(
              requestObject.kartoffelParams.id
            );
            entity.newEntityType =
              USER_ENTITY_TYPE[
                `${requestObject.kartoffelParams.newEntityType}`
              ];

            entity.upn = requestObject.kartoffelParams.upn;
            entity.identifier = requestObject.kartoffelParams.identifier;
            setUser(entity);
          } else if (requestObject.type === REQ_TYPES.DISCONNECT_ROLE) {
            const entity = await getEntityByMongoId(
              requestObject.kartoffelParams.id
            );
            const role = await getRoleByRoleId(
              requestObject.kartoffelParams.uniqueId
            );
            setUser(entity);
            setRole(role);
          } else if (requestObject.type === REQ_TYPES.EDIT_ENTITY) {
            // TODO: ask limora - why is this nessacery?
            const entity = await getEntityByMongoId(
              requestObject.kartoffelParams.id
            );

            entity.goalUserBrol = getUserRelevantIdentity(entity)?.role?.brol;

            // fills the gaps in request object
            Object.keys(requestObject.kartoffelParams).forEach((key) => {
              entity[key] = requestObject.kartoffelParams[key]
                ? requestObject.kartoffelParams[key]
                : entity[key];
            });

            setUser(entity);
          } else {
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
          }
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
          mobilePhone: !tempForm?.mobilePhone
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
          ...(user.firstName && { oldFirstName: user.firstName }),
          ...(user.lastName && { oldLastName: user.lastName }),
          ...(user.identityCard && {
            oldIdentityCard: user.identityCard,
          }),
          oldMobilePhone: !user?.mobilePhone
            ? []
            : Array.isArray(user.mobilePhone)
            ? user.mobilePhone
            : [user.mobilePhone],
          ...(user.rank && { oldRank: user.rank }),
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

    const getFormFieldsByEntityType = (user) => {
      const isEditEntity = requestObject.type === REQ_TYPES.EDIT_ENTITY;
      const isSoldier = user.entityType === configStore.KARTOFFEL_SOLDIER;
      const isCivilian = user.entityType === configStore.KARTOFFEL_CIVILIAN;
      const isExternal = user.entityType === configStore.KARTOFFEL_EXTERNAL;
      const isGoalUser = user.entityType === configStore.USER_ROLE_ENTITY_TYPE;

      const isDifferentFromPrev = (oldFieldValue, newFieldValue) => {
        return (
          oldFieldValue !== newFieldValue &&
          oldFieldValue !== undefined &&
          newFieldValue != undefined
        );
      };

      const conditionalFields = [
        {
          fieldName: 'personalNumber',
          condition: isSoldier,
        },
        {
          fieldName: 'rank',
          condition: isSoldier,
        },
        {
          fieldName: 'oldRank',
          condition:
            isSoldier &&
            isEditEntity &&
            isDifferentFromPrev(user['firstName'], user['oldFirstName']),
        },
        {
          fieldName: 'dischargeDay',
          condition: isSoldier,
        },
        {
          fieldName: 'oldFirstName',
          condition:
            isEditEntity &&
            isDifferentFromPrev(user['firstName'], user['oldFirstName']),
        },
        {
          fieldName: 'oldLastName',
          condition:
            isEditEntity &&
            isDifferentFromPrev(user['lastName'], user['oldLastName']),
        },
        {
          fieldName: 'oldIdentityCard',
          condition:
            isEditEntity &&
            isDifferentFromPrev(user['identityCard'], user['oldIdentityCard']),
        },
        {
          fieldName: 'oldMobilePhone',
          condition:
            isEditEntity &&
            isDifferentFromPrev(user['mobilePhone'], user['oldMobilePhone']),
        },
        {
          fieldName: 'rank',
          condition: isSoldier,
        },
        {
          fieldName: 'oldRank',
          condition:
            isSoldier &&
            isEditEntity &&
            isDifferentFromPrev(user['rank'], user['oldRank']),
        },
        {
          fieldName: 'organization',
          condition: isExternal,
        },
        {
          fieldName: 'employeeNumber',
          condition: isExternal,
        },
        {
          fieldName: 'goalUserBrol',
          condition: isGoalUser,
        },
      ];

      // TODO: check with liron which fields are needed in display each of the entity types
      let fieldsToDisplay = [
        'id',
        'samAccountName',
        'firstName',
        'oldFirstName',
        'lastName',
        'oldLastName',
        'personalNumber',
        'identityCard',
        'oldIdentityCard',
        'hierarchy',
        'mail',
        'jobTitle',
        'rank',
        'oldRank',
        'fullClearance',
        'address',
        'mobilePhone',
        'oldMobilePhone',
        'birthDate',
        'dischargeDay',
        'organization',
        'employeeNumber',
        'brol',
      ];

      // filters form fields that appear only conditionally
      fieldsToDisplay = fieldsToDisplay.filter((field) => {
        let currField = conditionalFields.find(
          (filterFields) => field === filterFields.fieldName
        );
        return currField === undefined || currField['condition'] ? true : false;
      });

      // takes from list of form fields the ones left after filtering
      let newForm = formFields.filter((field) => {
        return fieldsToDisplay.includes(field['fieldName']);
      });

      const getCustomFields = () => {
        let customFields = [];
        switch (requestObject.type) {
          case REQ_TYPES.EDIT_ENTITY:
            // Some fields required different conditions or different display names in edit entity request type
            customFields = [
              ...(reqView &&
              isDifferentFromPrev(user['firstName'], user['oldFirstName'])
                ? [{ fieldName: 'firstName', displayName: 'שם פרטי חדש' }]
                : []),
              ...(reqView &&
              isDifferentFromPrev(user['lastName'], user['oldLastName'])
                ? [{ fieldName: 'lastName', displayName: 'שם משפחה חדש' }]
                : []),
              ...(reqView &&
              isDifferentFromPrev(user['mobilePhone'], user['oldMobilePhone'])
                ? [{ fieldName: 'mobilePhone', displayName: 'טלפון נייד חדש' }]
                : []),
              ...(reqView && isDifferentFromPrev(user['rank'], user['oldRank'])
                ? [{ fieldName: 'rank', displayName: 'שם משפחה חדש' }]
                : []),
              ...(reqView &&
              isDifferentFromPrev(user['identityCard'], user['oldIdentityCard'])
                ? [{ fieldName: 'identityCard', displayName: 'ת"ז חדשה' }]
                : []),
            ];
            break;
        }

        return customFields;
      };

      // customized field propreties
      getCustomFields().forEach((customField) => {
        Object.keys(customField).forEach((key) => {
          newForm.find((field) => field.fieldName === customField.fieldName)[
            key
          ] = customField[key];
        });
      });

      return newForm;
    };

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
        fieldName: 'oldFirstName',
        displayName: 'שם פרטי ישן',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => reqView,
      },
      {
        fieldName: 'lastName',
        displayName: 'שם משפחה',
        inputType: InputTypes.TEXT,
        canEdit: methods.watch('canEditEntityFields'),
        force: true,
      },
      {
        fieldName: 'oldLastName',
        displayName: 'שם משפחה ישן',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => reqView,
      },
      {
        fieldName: 'personalNumber',
        displayName: 'מ"א',
        inputType: InputTypes.TEXT,
        // secured: () => !reqView,
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
        fieldName: 'oldIdentityCard',
        displayName: 'ת"ז קודמת',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => reqView,
      },
      {
        fieldName: 'rank',
        displayName: 'דרגה',
        inputType: InputTypes.TEXT,
        secured: () => !reqView,
      },
      {
        fieldName: 'oldRank',
        displayName: 'דרגה ישנה',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => !reqView,
      },
      {
        fieldName: 'hierarchy',
        displayName: 'היררכיה',
        inputType: InputTypes.TEXT,
        force: true,
        // secured: () => !reqView,
        withTooltip: true,
      },
      {
        fieldName: 'mail',
        displayName: 'מייל',
        inputType: InputTypes.TEXT,
        force: true,
        // secured: () => !reqView,
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
        fieldName: 'oldMobilePhone',
        displayName: 'פלאפון נייד ישן',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => reqView,
      },
      {
        fieldName: 'birthDate',
        displayName: 'תאריך לידה',
        inputType: InputTypes.CALANDER,
        // secured: () => !reqView,
        untilNow: true,
      },
      {
        fieldName: 'dischargeDay',
        displayName: 'תק"ש',
        inputType: InputTypes.CALANDER,
        secured: () => !reqView,
      },
      {
        fieldName: 'organization',
        displayName: 'ארגון',
        inputType: InputTypes.TEXT,
        type: 'string',
        keyFilter: 'string',
        canEdit: false,
        force: true,
      },
      {
        fieldName: 'employeeNumber',
        displayName: 'מספר עובד',
        inputType: InputTypes.TEXT,
        type: 'string',
        keyFilter: 'string',
        canEdit: false,
        force: true,
      },
      {
        fieldName: 'goalUserBrol',
        displayName: 'brol',
        inputType: InputTypes.TEXT,
        type: 'string',
        keyFilter: 'string',
        canEdit: false,
        force: true,
      },
      {
        fieldName: 'fullClearance',
        displayName: 'סיווג מלא',
        canEdit: true,
        secured: () => methods.watch('canSeeUserFullClearance'),
        force: true,
        inputType: InputTypes.TEXT,
        type: 'num',
        keyFilter: 'num',
      },
    ];

    const convertFormFields = [
      {
        fieldName: 'newEntityType',
        displayName: 'סוג הישות החדש',
        inputType: InputTypes.TEXT,
      },
      {
        fieldName: 'upn',
        displayName: 'מזהה כרטיס חדש',
        inputType: InputTypes.TEXT,
        force: true,
      },
      {
        fieldName: 'firstName',
        displayName: 'שם פרטי',
        inputType: InputTypes.TEXT,
      },
      {
        fieldName: 'lastName',
        displayName: 'שם משפחה',
        inputType: InputTypes.TEXT,
      },
      {
        fieldName: 'identifier',
        displayName: 'מ"א/ת"ז להוספה',
        inputType: InputTypes.TEXT,
      },
      {
        fieldName: 'personalNumber',
        displayName: 'מ"א',
        inputType: InputTypes.TEXT,
      },
      {
        fieldName: 'identityCard',
        displayName: 'ת"ז',
        inputType: InputTypes.TEXT,
      },
      {
        fieldName: 'jobTitle',
        displayName: 'תפקיד',
        inputType: InputTypes.TEXT,
      },
    ];

    const disconnectRoleFromEntityFields = [
      {
        fieldName: 'jobTitle',
        displayName: 'שם תפקיד',
        inputType: InputTypes.TEXT,
      },
      {
        fieldName: 'hierarchy',
        displayName: 'היררכית תפקיד',
        inputType: InputTypes.TEXT,
        force: true,
      },
      {
        fieldName: 'roleId',
        displayName: 'מזהה תפקיד',
        inputType: InputTypes.TEXT,
      },
    ];

    const getInputFields = (item, fields, reqView) => {
      return (
        <InputForm
          fields={fields}
          item={item}
          errors={errors}
          methods={methods}
        />
      );
    };

    const getForm = (type) => {
      switch (type) {
        case REQ_TYPES.CONVERT_ENTITY_TYPE:
          return reqView && getInputFields(user, convertFormFields);
        case REQ_TYPES.DISCONNECT_ROLE:
          let viewUserFields = getFormFieldsByEntityType(user);
          return (
            reqView && (
              <>
                <div
                  style={{
                    width: '100%',
                    paddingBottom: '10px',
                  }}
                >
                  <p>פרטי המשתמש שנותק מהתפקיד:</p>
                </div>
                {getInputFields(user, viewUserFields)}
                <div style={{ width: '100%', paddingBottom: '10px' }}>
                  <p>פרטי התפקיד שנותק:</p>
                </div>
                {getInputFields(role, disconnectRoleFromEntityFields)}
              </>
            )
          );
        default:
          let fields = getFormFieldsByEntityType(user);
          return getInputFields(user, fields);
      }
    };
    return (
      <div className="p-fluid" id="fullEntityInfoForm">
        {getForm(requestObject.type)}
      </div>
    );
  }
);

export { FullEntityInformationForm };

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
  GOAL_USER_NAME_REG_EXP,
  IDENTITY_CARD_EXP,
  NAME_REG_EXP,
  PHONE_REG_EXP,
  REQ_TYPES,
} from '../../../constants';

const validationSchema = Yup.object().shape({
  canEditEntityFields: Yup.boolean(),
  firstName: Yup.string().when(['canEditEntityFields'], {
    is: true,
    then: Yup.string()
      .required('יש לבחור שם פרטי')
      .matches(NAME_REG_EXP, 'שם לא תקין'),
  }),
  lastName: Yup.string().when(['canEditEntityFields', '$isGoalUser'], {
    is: (canEditEntityFields, isGoalUser) => { return canEditEntityFields && !isGoalUser },
    then: Yup.string()
      .required('יש לבחור שם משפחה')
      .matches(NAME_REG_EXP, 'שם לא תקין'),
    otherwise:
      Yup.string()
        .required('יש לבחור שם משפחה')
        .matches(GOAL_USER_NAME_REG_EXP, 'שם לא תקין. עבור תפקידן השם משפחה יכול להכיל גם רק מספרים.'),
  }),
  identityCard: Yup.string().when(['canEditEntityFields', '$isGoalUser'], {
    is: (canEditEntityFields, isGoalUser) => { return canEditEntityFields && !isGoalUser },
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
  mobilePhone: Yup.mixed().when(['canEditEntityFields', '$isGoalUser'], {
    is: (canEditEntityFields, isGoalUser) => { return canEditEntityFields && !isGoalUser },
    then: Yup.string('נא להזין מספר')
      .required('נא להזין מספר')
      .matches(PHONE_REG_EXP, 'מספר לא תקין'),
    otherwise: Yup.mixed().when('$isGoalUser', {
      is: true,
      then: Yup.string('נא להזין מספר').test({
        name: 'is-valid-phone',
        message: 'טלפון לא תקין',
        test: (mobilePhone) => {
          let regex = new RegExp(mobilePhone)
          return !mobilePhone || regex.test(PHONE_REG_EXP)
        }
      })
    })
  }),
  canSeeUserFullClearance: Yup.boolean(),
});

const FullEntityInformationForm = forwardRef(
  (
    {
      setIsActionDone,
      onlyForView,
      requestObject,
      reqView = true,
      setIsEdit,
      clickTracking,
    },

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
      context: {
        isGoalUser: user.entityType === configStore.USER_ROLE_ENTITY_TYPE,
      }
    });
    const { errors } = methods.formState;
    useEffect(async () => {
      if (requestObject) {
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
            setUser(entity);

            const role = await getRoleByRoleId(
              requestObject.kartoffelParams.uniqueId
            );

            setRole(role);
          } else if (requestObject.type === REQ_TYPES.EDIT_ENTITY) {
            // TODO: ask limora - why is this nessacery?
            const entity = await getEntityByMongoId(
              requestObject.kartoffelParams.id
            );

            entity.goalUserBrol = getUserRelevantIdentity(entity)?.upn;
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

    const hasFieldsChanged = (user) => {
      if (!user) {
        return false;
      }

      let changedForm = false;
      let formFields = getFormFieldsByEntityType(user);

      let fieldsToCheck = [];
      formFields.forEach((field) => {
        if (field?.canEdit === true) {
          fieldsToCheck.push(field.fieldName);
        }
      });

      fieldsToCheck.forEach((field) => {
        if (isDifferentFromPrev(methods.watch(field), user[field])) {
          changedForm = true;
        }
      });

      return changedForm;
    };

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
          ...(tempForm.fullClearance && {
            fullClearance: tempForm.fullClearance,
          }),
          ...(tempForm.sex && { sex: tempForm.sex }),
          ...(tempForm.birthDate && {
            birthdate: datesUtil.getTime(tempForm.birthDate)
              ? datesUtil.getTime(tempForm.birthDate)
              : datesUtil.getTime(user.birthDate),
          }),
          ...(tempForm.entityType && { entityType: tempForm.entityType }),
          ...(tempForm.personalNumber && {
            personalNumber: tempForm.personalNumber,
          }),
          ...(tempForm.rank && { rank: tempForm.rank }),

          ...(tempForm.identityCard && { identityCard: tempForm.identityCard }),
          ...(user.firstName && { oldFirstName: user.firstName }),
          ...(user.lastName && { oldLastName: user.lastName }),
          ...(user.identityCard && {
            oldIdentityCard: user.identityCard,
          }),
          ...(user.rank && { oldRank: user.rank }),
          oldMobilePhone: !user?.mobilePhone
            ? []
            : Array.isArray(user.mobilePhone)
              ? user.mobilePhone
              : [user.mobilePhone],
          ...(user.rank && { oldRank: user.rank }),
        };

        const samAccountName = getSamAccountNameFromEntity(tempForm);

        if (hasFieldsChanged(user)) {
          await appliesStore.editEntityApply({
            kartoffelParams,
            adParams: {
              samAccountName: samAccountName,
              firstName: tempForm.firstName,
              lastName: tempForm.lastName,
              fullName: tempForm.fullName,
            },
          });
          clickTracking('עריכת משתמש');
          setIsActionDone(true);
          setIsEdit(false);
        } else {
          methods.setError('editEntity', {
            message: 'לא חל שינוי בטופס לצורך ביצוע העריכה',
          });
        }
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

    const isDifferentFromPrev = (oldFieldValue, newFieldValue) => {
      return oldFieldValue !== newFieldValue && (newFieldValue || oldFieldValue);
    };

    const getFormFieldsByEntityType = (user) => {
      const isEditEntity = requestObject.type === REQ_TYPES.EDIT_ENTITY;
      const isSoldier = user.entityType === configStore.KARTOFFEL_SOLDIER;
      const isExternal = user.entityType === configStore.KARTOFFEL_EXTERNAL;
      const isGoalUser = user.entityType === configStore.USER_ROLE_ENTITY_TYPE;

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
            isDifferentFromPrev(user['rank'], user['oldRank']),
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
            isDifferentFromPrev(
              Array.isArray(user['mobilePhone'])
                ? user['mobilePhone'][0]
                : user['mobilePhone'],
              Array.isArray(user['oldMobilePhone'])
                ? user['oldMobilePhone'][0]
                : user['oldMobilePhone']
            ),
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
        {
          fieldName: 'fullClearance',
          condition: !isEditEntity,
        },
      ];

      // TODO: check with liron which fields are needed in display each of the entity types
      let fieldsToDisplay = formFields.map((field) => field.fieldName)

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
                isDifferentFromPrev(
                  Array.isArray(user['mobilePhone'])
                    ? user['mobilePhone'][0]
                    : user['mobilePhone'],
                  Array.isArray(user['oldMobilePhone'])
                    ? user['oldMobilePhone'][0]
                    : user['oldMobilePhone']
                )
                ? [{ fieldName: 'mobilePhone', displayName: 'טלפון נייד חדש' }]
                : []),
              ...(reqView && isDifferentFromPrev(user['rank'], user['oldRank'])
                ? [{ fieldName: 'rank', displayName: 'דרגה חדשה' }]
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
          let currField = newForm.find(
            (field) => field.fieldName === customField.fieldName
          );
          if (currField) {
            currField[key] = customField[key];
          }
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
        fieldName: 'firstName',
        displayName: 'שם פרטי',
        inputType: InputTypes.TEXT,
        canEdit: methods.watch('canEditEntityFields'),
        force: true,
        isEdit: !onlyForView && methods.watch('canEditEntityFields'),
      },
      {
        fieldName: 'oldFirstName',
        displayName: 'שם פרטי קודם',
        inputType: InputTypes.TEXT,
        secured: () => reqView,
      },
      {
        fieldName: 'lastName',
        displayName: 'שם משפחה',
        inputType: InputTypes.TEXT,
        canEdit: methods.watch('canEditEntityFields'),
        force: true,
        isEdit: !onlyForView && methods.watch('canEditEntityFields'),
      },
      {
        fieldName: 'oldLastName',
        displayName: 'שם משפחה קודם',
        inputType: InputTypes.TEXT,
        secured: () => reqView,
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
        type: 'num',
        keyFilter: 'num',
        // isEdit: !onlyForView && methods.watch('canEditEntityFields'),
        canEdit: methods.watch('canEditEntityFields'),
      },
      {
        fieldName: 'oldIdentityCard',
        displayName: 'ת"ז קודמת',
        inputType: InputTypes.TEXT,
        secured: () => reqView,
      },
      {
        fieldName: 'rank',
        displayName: 'דרגה',
        inputType: InputTypes.DROPDOWN,
        options: configStore.KARTOFFEL_RANKS,
        canEdit: methods.watch('canEditEntityFields'),
        isEdit: !onlyForView && methods.watch('canEditEntityFields'),
        force: true,
        additionalClass: 'dropDownInput',
      },
      {
        fieldName: 'oldRank',
        displayName: 'דרגה קודמת',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => reqView,
      },
      {
        fieldName: 'jobTitle',
        displayName: 'תפקיד',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => !reqView,
      },
      {
        fieldName: 'hierarchy',
        displayName: 'היררכיה',
        inputType: InputTypes.TEXT,
        withTooltip: true,
      },
      {
        fieldName: 'mobilePhone',
        displayName: 'טלפון נייד',
        inputType: InputTypes.TEXT,
        type: 'num',
        keyFilter: 'num',
        canEdit: methods.watch('canEditEntityFields'),
        force: true,
        isEdit: !onlyForView && methods.watch('canEditEntityFields'),
      },
      {
        fieldName: 'mail',
        displayName: 'מזהה ייחודי',
        inputType: InputTypes.TEXT,
      },
      {
        fieldName: 'address',
        displayName: 'כתובת',
        inputType: InputTypes.TEXT,
        secured: () => !reqView,
      },

      {
        fieldName: 'oldMobilePhone',
        displayName: 'טלפון נייד קודם',
        inputType: InputTypes.TEXT,
        force: true,
        secured: () => reqView,
      },
      {
        fieldName: 'birthDate',
        displayName: 'תאריך לידה',
        inputType: InputTypes.CALANDER,
        untilNow: true,
        secured: () => !reqView,
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

    const getInputFields = (item, fields) => {
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
        {errors && errors?.editEntity && (
          <small style={{ color: 'red' }}>
            {errors.editEntity?.message
              ? errors.editEntity.message
              : 'יש למלא ערך'}
          </small>
        )}
      </div>
    );
  }
);

export { FullEntityInformationForm };

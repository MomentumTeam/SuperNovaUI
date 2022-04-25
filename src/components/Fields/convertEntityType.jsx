import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useStores } from '../../context/use-stores';
import { useToast } from '../../context/use-toast';
import { useForm } from 'react-hook-form';
import { USER_ENTITY_TYPE, IDENTITY_CARD_EXP } from '../../constants';
import { getEntityByIdentifier } from '../../service/KartoffelService';
import {
  getUserRelevantIdentity,
  getSamAccountNameFromEntity,
  kartoffelIdentityCardValidation,
} from '../../utils';

const validationSchema = Yup.object().shape({
  identifier: Yup.string().when('missingInfo', {
    is: (missingInfo) => !missingInfo,
    then: Yup.string().optional(),
    otherwise: Yup.string().when('isSoldier', {
      is: (isSoldier) => !isSoldier,
      then: Yup.string().required('יש להזין מספר אישי!'),
      otherwise: Yup.string()
        .required('יש להזין ת"ז!')
        .matches(IDENTITY_CARD_EXP, 'ת"ז לא תקין')
        .test({
          name: 'check-if-valid',
          message: 'ת"ז לא תקין!',
          test: async (identifier, context) => {
            if (!context.isSoldier) {
              return kartoffelIdentityCardValidation(identifier);
            }
            return true;
          },
        })
        .test({
          name: 'check-if-identity-number-already-taken-in-kartoffel',
          message: 'קיים משתמש עם הת"ז הזה!',
          test: async (identifier, context) => {
            if (!context.isSoldier) {
              try {
                const isAlreadyTaken = await getEntityByIdentifier(identifier);

                if (isAlreadyTaken) {
                  return false;
                }
              } catch (err) {}
            }
            return true;
          },
        }),
    }),
  }),
});

const ConvertEntityType = ({ entity = {} }) => {
  const { userStore, appliesStore } = useStores();
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isSoldier = entity.entityType === 'agumon'; //true=soldier , false=civilian
  const entityDi = getUserRelevantIdentity(entity);
  const missingInfo =
    (isSoldier && !entity.identityCard) ||
    (!isSoldier && !entity.personalNumber);

  const { register, handleSubmit, watch, formState, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { identifier: '', entity, missingInfo },
  });

  const { errors } = formState;
  const { actionPopup } = useToast();

  const openDialog = async () => {
    setIsMainOpen(true);
  };

  const closeDialog = async () => {
    setIsMainOpen(false);
    setIsOpen(false);
  };

  const onSubmit = async (data = {}) => {
    try {
      await validationSchema.validate(data);
    } catch (err) {
      console.log('err', err);
      throw new Error(err.errors);
    }

    const req = {
      commanders: [userStore.user],
      kartoffelParams: {
        id: entity.id,
        uniqueId: entityDi.role.digitalIdentityUniqueId,
        newEntityType: isSoldier
          ? USER_ENTITY_TYPE.Civilian
          : USER_ENTITY_TYPE.Soldier,
      },
      adParams: {
        samAccountName: getSamAccountNameFromEntity(entity),
        firstName: entity.firstName,
        lastName: entity.lastName,
        fullName: entity.fullName,

        //TODO- לשאול את ראובן מה זה
        roleSerialCode: 'abc',
      },
      due: Date.now(),
    };

    if (entity.rank) {
      req.adParams.rank = entity.rank;
    }
    if (entityDi.upn) {
      req.adParams.upn = entityDi.upn;
      req.kartoffelParams.upn = entityDi.upn;
    }

    if (data?.identifier !== '' && missingInfo) {
      req.kartoffelParams.identifier = data?.identifier;
    }

    await appliesStore.convertEntityTypeApply(req);
    closeDialog();
  };

  const handleRequest = async () => {
    try {
      await onSubmit();
    } catch (e) {
      actionPopup('המרת סןג ישןת', e.message || 'Message Content');
    }
    actionPopup('המרת סןג ישןת');
  };

  return (
    <>
      <Dialog
        className="dialogClass7"
        header="השלמת פרטים חסרים"
        visible={isOpen}
        onHide={() => setIsOpen(false)}
        dismissableMask={true}
        style={{ width: '25vw', minHeight: '250px' }}
        // footer={}
      >
        <div className="container">
          <div style={{ margin: '2vw' }}>
            <p style={{ fontWeight: 'bold' }}>
              {isSoldier ? 'הכנס תעודת זהות:' : 'הכנס מספר אישי:'}
            </p>
          </div>

          <form onSubmit={handleSubmit(handleRequest)}>
            <InputText
              {...register('identifier')}
              value={watch('identifier')}
              keyfilter="num"
              // id=""
              type="num"
              // required
              onChange={(e) => {
                setValue('identifier', e.target.value, {
                  shouldValidate: true,
                });
              }}
            />
            {errors.identifier && (
              <small style={{ color: 'red' }}>
                {' '}
                {errors.identifier?.message
                  ? errors.identifier.message
                  : 'יש למלא ערך'}
              </small>
            )}
            <Button
              type="submit"
              label="אישור"
              className="btn-orange-gradient"
              id="fullEntityInfo-closeOrSave"
            />
          </form>
        </div>
      </Dialog>
      <Dialog
        className="dialogClass7"
        header="המרת סוג ישות"
        visible={isMainOpen}
        onHide={() => setIsMainOpen(false)}
        dismissableMask={true}
        style={{ width: '25vw', minHeight: '250px' }}
        footer={
          <>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Button
                style={{ marginLeft: '20px' }}
                className="btn-border blue"
                label={
                  isSoldier
                    ? 'כן, הפוך את החייל לאזרח'
                    : 'כן, הפוך את האזרח לחייל'
                }
                onClick={async () => {
                  if (missingInfo) {
                    setIsOpen(true);
                  } else {
                    onSubmit();
                  }
                }}
              />
              <Button
                label={
                  isSoldier
                    ? 'לא, השאר את החייל כחייל'
                    : 'לא, השאר את האזרח כאזרח'
                }
                className="btn-border red"
                onClick={closeDialog}
              />
            </div>
          </>
        }
      >
        <div className="container">
          <div style={{ margin: '2vw' }}>
            <p style={{ fontWeight: 'bold' }}>
              {isSoldier
                ? 'האם את/ה בטוח/ה שתרצה/י להפוך את החייל לאזרח?'
                : 'האם את/ה בטוח/ה שתרצה/י להפוך את האזרח לחייל?'}
            </p>

            <p>
              {isSoldier
                ? 'המשמעות- שינוי מזהה הכרטיס מתעודת זהות C למספר אישי S'
                : 'המשמעות- שינוי מזהה הכרטיס ממספר אישי S לתעודת זהות C'}
            </p>
          </div>
        </div>
      </Dialog>
      <div>
        <Button
          id="export-button"
          icon="pi pi-user-edit"
          label={isSoldier ? ' הפוך מחייל לאזרח' : '  הפוך מאזרח לחייל '}
          className="btn-border blue"
          onClick={openDialog}
        />
      </div>
    </>
  );
};

export { ConvertEntityType };

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useToast } from '../../context/use-toast';
import { useStores } from '../../context/use-stores';
import { getSamAccountNameFromEntity } from '../../utils/fields';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { IDENTITY_CARD_EXP } from '../../constants';
import { kartoffelIdentityCardValidation } from '../../utils/user';
import { getEntityByIdentifier } from '../../service/KartoffelService';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useEffect } from 'react';

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

const ConvertEntityType = ({ entity = {}, entityDi = {} }) => {
  const { userStore, appliesStore, configStore } = useStores();
  const [isMainOpen, setIsMainOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { actionPopup } = useToast();

  const isSoldier = entity.entityType === configStore.KARTOFFEL_SOLDIER; //true=soldier , false=civilian
  const missingInfo =
    (isSoldier && !entity.identityCard) ||
    (!isSoldier && !entity.personalNumber);

  const { register, handleSubmit, watch, formState, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { identifier: '', entity, missingInfo, isSoldier },
  });

  const { errors } = formState;

  useEffect(() => {
    if (submitted) {
      closeDialog();
    }
  }, [submitted]);

  const openDialog = async () => {
    setIsMainOpen(true);
  };

  const closeDialog = async () => {
    setIsMainOpen(false);
    setIsOpen(false);
    setValue('identifier', '');
  };

  const onSubmit = async (data = {}) => {
    try {
      await validationSchema.validate(data);
    } catch (err) {
      throw new Error(err.errors);
    }

    const req = {
      commanders: [userStore.user],
      kartoffelParams: {
        id: entity.id,
        uniqueId: entityDi?.role?.digitalIdentityUniqueId,
        newEntityType: isSoldier
          ? configStore.KARTOFFEL_CIVILIAN
          : configStore.KARTOFFEL_SOLDIER,
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

    if (data?.identifier !== '' && missingInfo) {
      req.kartoffelParams.identifier = data?.identifier;
    }

    try {
      setSubmitted(true);
      await appliesStore.convertEntityTypeApply(req);
      setSubmitted(false);
      closeDialog();
      actionPopup('המרת סוג ישות');
    } catch (e) {
      setSubmitted(false);
      actionPopup('המרת סוג ישות', e.message || 'Message Content');
    }
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
        footer={
          <div style={{ direction: 'ltr' }}>
            <Button
              disabled={submitted}
              type="submit"
              label="אישור"
              className="btn-gradient orange"
              id="fullEntityInfo-closeOrSave"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        }
      >
        <div
          className="p-fluid"
          style={{
            marginTop: '2vw',
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className="p-fluid-item p-fluid-item-flex1"
              style={{ marginRight: '25px' }}
            >
              <div
                className="p-field"
                style={{
                  display: 'flex',
                }}
              >
                <label
                  htmlFor="2021"
                  style={{
                    marginTop: '15px',
                  }}
                >
                  <span className="required-field">*</span>
                  {isSoldier ? 'הכנס תעודת זהות:' : 'הכנס מספר אישי:'}
                </label>
                <div
                  style={{
                    width: '200px',
                    marginBottom: '5px',
                    marginRight: '15px',
                  }}
                >
                  {' '}
                  <InputText
                    {...register('identifier')}
                    value={watch('identifier')}
                    keyfilter="num"
                    // id=""
                    type="num"
                    required
                    onChange={(e) => {
                      setValue('identifier', e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                  />{' '}
                  {errors.identifier && (
                    <small style={{ color: 'red' }}>
                      {' '}
                      {errors.identifier?.message
                        ? errors.identifier.message
                        : 'יש למלא ערך'}
                    </small>
                  )}
                </div>
              </div>
            </div>
            {/* <div className="display-flex ">
            <div className="display-flex"></div>
              <div className="display-flex ">
                <Button
                  disabled={submitted}
                  type="submit"
                  label="אישור"
                  className="btn-gradient orange"
                  id="fullEntityInfo-closeOrSave"
                />
              </div>
            </div> */}
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
                disabled={submitted}
                style={{ marginLeft: '20px' }}
                // className="btn-border blue"
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
                className="p-button-danger"
                // className="btn-border red"
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
                ? 'המשמעות- שינוי מזהה הכרטיס ממספר אישי S לתעודת זהות C'
                : 'המשמעות- שינוי מזהה הכרטיס מתעודת זהות C למספר אישי S'}
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

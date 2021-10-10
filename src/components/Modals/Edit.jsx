import React from 'react';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import blankProfilePic from '../../assets/images/blankProfile.png';
import '../../assets/css/local/general/buttons.css';
import '../../assets/css/local/components/modal-item.css';
import { useForm } from 'react-hook-form';
import { useStores } from '../../context/use-stores';
import { Button } from 'primereact/button';

const Edit =(
  (
    {
      user,
      userPicture,
      isOpen,
      isEditMode,
      setIsEditMode,
      closeFullDetailsModal,
    },
  ) => {
    const { userStore, appliesStore,  } = useStores();

    const {
      register,
      handleSubmit,
      getValues,
      formState,
      reset,
    } = useForm({
      defaultValues: user,
    });

    const submitedData = async (data) => {
      if (isEditMode) {

        const { firstName, lastName, identityCard, mobilePhone } =
          data;
        
        const uniqueID = await userStore.getUniqueId();

        const req = {
          kartoffelParams: {
            id: user.id,
            firstName: firstName,
            lastName: lastName,
            identityCard: identityCard,
            mobilePhone: mobilePhone,
          },
          adParams: {
            samAccountName: uniqueID,
            firstName: firstName,
            lastName: lastName,
            fullName: `${firstName} ${lastName}`,
          },
        };
        
        reset(user);
        closeFullDetailsModal();
        return await appliesStore.editEntityApply(req);
      }
      closeFullDetailsModal();

    };

    const renderFooter = () => {
      return (
        <div>
          <div className="display-flex">
            {isEditMode && user.rank != 'אזרח' && (
              <Button
                label="ביטול"
                onClick={() => setIsEditMode(false)}
                className="btn-underline"
              />
            )}
            {!isEditMode && user.rank != 'אזרח' && (
              <Button
                label="עריכה"
                onClick={() => setIsEditMode(true)}
                className="btn-border orange"
              />
            )}
            <Button
              label={isEditMode ? 'שמור' : 'סגור'}
              onClick={handleSubmit(submitedData)}
              className="btn-gradient orange"
            />
          </div>
        </div>
      );
    };

    return (
      <Dialog
        className={classNames('dialogClass7')}
        header={isEditMode ? 'עריכת המשתמש שלי' : 'פרטי משתמש/ת'}
        visible={isOpen}
        footer={renderFooter}
        style={{ borderRadius: '30px' }}
        onHide={closeFullDetailsModal}
      >
        <div>
          <div className="userpic-wrap">
            <img
              style={{ borderRadius: '50%', width: '142px' }}
              src={
                user && userPicture
                  ? `data:image/jpeg;base64,${userPicture}`
                  : blankProfilePic
              }
              alt="userpic"
            />
          </div>

          <div className="p-fluid">
            {(user.rank != 'אזרח' && (
              <div className="p-fluid-item">
                <div className="p-field">
                  <label>שם מלא</label>
                  <InputText
                    id="2011"
                    type="text"
                    disabled={!isEditMode}
                    value={`${getValues(`firstName`)} ${getValues(`lastName`)}`}
                  />
                </div>
              </div>
            )) || (
              <div className="p-fluid">
                <div className="p-fluid-item">
                  <div className="p-field">
                    <label>שם פרטי</label>
                    <InputText
                      id="2011"
                      type="text"
                      disabled={!isEditMode}
                      defaultValue={user.firstName}
                      {...register('firstName')}
                    />
                  </div>
                </div>

                <div className="p-fluid-item">
                  <div className="p-field">
                    <label>שם משפחה</label>
                    <InputText
                      id="2011"
                      type="text"
                      disabled={!isEditMode}
                      defaultValue={getValues(`lastName`)}
                      {...register('lastName')}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="p-fluid-item">
              <div className="p-field">
                <label>ת"ז</label>
                <InputText
                  id="2014"
                  type="text"
                  disabled={!isEditMode}
                  defaultValue={getValues('identityCard')}
                  {...register('identityCard', {
                    required: true 
                  })}
                />
              </div>
            </div>

            {
              (user.rank = !'אזרח' && (
                <div className="p-fluid">
                  <div className="p-fluid-item">
                    <div className="p-field">
                      <label>תאריך לידה</label>
                      <InputText
                        id="2012"
                        type="text"
                        disabled={true}
                        value={new Date(getValues('birthDate')).toDateString()}
                      />
                    </div>
                  </div>
                  <div className="p-fluid-item">
                    <div className="p-field">
                      <label>מ"א</label>
                      <InputText
                        id="2013"
                        type="text"
                        disabled={true}
                        value={getValues('personalNumber')}
                      />
                    </div>
                  </div>

                  <div className="p-fluid-item">
                    <div className="p-field">
                      <label>תק"ש</label>
                      <InputText
                        id="2015"
                        type="text"
                        disabled={true}
                        value={getValues('dischargeDay')}
                      />
                    </div>
                  </div>
                  <div className="p-fluid-item">
                    <div className="p-field">
                      <label>דרגה</label>
                      <InputText
                        id="2016"
                        type="text"
                        disabled={true}
                        value={getValues('rank')}
                      />
                    </div>
                  </div>
                </div>
              ))
            }

            <div className="p-fluid-item">
              <div className="p-field">
                <label>היררכיה</label>
                <InputText
                  id="2017"
                  type="text"
                  disabled={true}
                  value={getValues('hierarchy')}
                />
              </div>
            </div>

            {
              (user.rank = !'אזרח' && (
                <div className="p-fluid">
                  <div className="p-fluid-item">
                    <div className="p-field">
                      <label>יוזר</label>
                      <InputText
                        id="2018"
                        type="text"
                        disabled={true}
                        value={getValues('mail')}
                      />
                    </div>
                  </div>

                  <div className="p-fluid-item">
                    <div className="p-field">
                      <label>תפקיד</label>
                      <InputText
                        id="2020"
                        type="text"
                        disabled={true}
                        value={getValues('jobTitle')}
                      />
                    </div>
                  </div>

                  <div className="p-fluid-item">
                    <div className="p-field">
                      <label>כתובת</label>
                      <InputText
                        id="2021"
                        type="text"
                        disabled={true}
                        value={getValues('address')}
                      />
                    </div>
                  </div>
                </div>
              ))
            }

            <div className="p-fluid-item">
              <div className="p-field">
                <label>טלפון</label>
                <InputText
                  id="2022"
                  type="text"
                  disabled={!isEditMode}
                  defaultValue={getValues('mobilePhone')}
                  {...register('mobilePhone')}
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
);

export default Edit;

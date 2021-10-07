import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import blankProfilePic from '../../assets/images/blankProfile.png';



import { useForm } from 'react-hook-form';
import '../../assets/css/local/pages/dashboard.min.css';
import { useStores } from '../../context/use-stores';
import { Button } from 'primereact/button';

const edit = forwardRef(
  (
    {
      user,
      userPicture,
      isOpen,
      closeFullDetailsModal,
    },
    ref
  ) => {
    const { userStore, appliesStore, treeStore } = useStores();

    const [editMode, setEditMode] = useState(false);
    const { register, handleSubmit, setValue, getValues, formState, watch } = useForm({ defaultValues: user });

    const submitedData = async (data) => {
      console.log('submitedData', data);
      const { firstName, lastName, identityCard, phone } = data;
    };

    useEffect(() => {
    //   setValue('approverType', 'COMMANDER');
    //   setApproverType('COMMANDER');
    }, []);

    const changeEditMode = () => {
      if (editMode) setEditMode(false);
      else setEditMode(true);
    };

    const renderFooter = (name) => {
      return (
        <div className="display-flex">
          <div className="display-flex">
            {editMode && (
              <Button
                label="ביטול"
                onClick={() => changeEditMode(false)}
                className="btn-underline"
              />
            )}
            {!editMode && (
              <Button
                label="עריכה"
                onClick={() => changeEditMode(true)}
                className="btn-border orange"
              />
            )}
            <Button
              label={editMode ? 'שמור' : 'סגור'}
              onClick={() => closeFullDetailsModal(name)}
              className="btn-gradient orange"
            />
          </div>
        </div>
      );
    };

    useImperativeHandle(
      ref,
      () => ({
        handleSubmit: handleSubmit(submitedData),
      }),
      []
    );

    return (
      <Dialog
        className={classNames('dialogClass7')}
        header="פרטי משתמש/ת"
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
                    disabled={!editMode}
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
                      disabled={!editMode}
                      value={getValues(`firstName`)}
                      onChange={setValue('firstName')}
                    />
                  </div>
                </div>

                <div className="p-fluid-item">
                  <div className="p-field">
                    <label>שם משפחה</label>
                    <InputText
                      id="2011"
                      type="text"
                      disabled={!editMode}
                      value={getValues(`lastName`)}
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
                  disabled={!editMode}
                  value={getValues('identityCard')}
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
                        disabled={!editMode}
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
                        disabled={!editMode}
                        value={getValues('personalNumber')}
                        // onChange={(e) => setValue(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="p-fluid-item">
                    <div className="p-field">
                      <label>תק"ש</label>
                      <InputText
                        id="2015"
                        type="text"
                        disabled={!editMode}
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
                        disabled={!editMode}
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
                  disabled={!editMode}
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
                        disabled={!editMode}
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
                        disabled={!editMode}
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
                        disabled={!editMode}
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
                  disabled={!editMode}
                  value={getValues('mobilePhone')[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
);

// ApproverForm.defaultProps = {
//   onlyForView: false,
//   approverRequestObj: {},
// };

export default edit;

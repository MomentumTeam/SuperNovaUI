import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import blankProfilePic from '../../assets/images/blankProfile.png';

import '../../assets/css/local/general/buttons.css';
import '../../assets/css/local/components/modal-item.css';

const FullUserInformationModal = ({
  user,
  getValues,
  setValue,
  userPicture,
  isOpen,
  renderFooter,
  editMode,
  closeFullDetailsModal,
  
}) => (
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
              value={getValues("identityCard")}
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
                    value={new Date(getValues("birthDate")).toDateString()}
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
                    value={getValues("personalNumber")}
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
                    value={getValues("dischargeDay")}
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
                    value={getValues("rank")}
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
              value={getValues("hierarchy")}
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
                    value={getValues("mail")}
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
                    value={getValues("jobTitle")}
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
                    value={getValues("address")}
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
              value={getValues("mobilePhone")[0]}
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
);

export default FullUserInformationModal;

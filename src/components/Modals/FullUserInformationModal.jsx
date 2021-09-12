
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import blankProfilePic from '../../assets/images/blankProfile.png';

import '../../assets/css/local/general/buttons.css';
import '../../assets/css/local/components/modal-item.css';

const FullUserInformationModal = ({user, isOpen, closeFullDetailsModal}) => (
    <Dialog className={classNames('dialogClass7')} header="פרטי משתמש/ת" visible={isOpen} style={{borderRadius: '30px'}} onHide={closeFullDetailsModal} >
        <div>
            <div className="userpic-wrap">
                <img
                  style={{borderRadius: '50%', width: '142px'}}
                  src={
                      user && user.picture
                        ? `data:image/jpeg;base64,${user.picture}`
                        : blankProfilePic
                  }
                  alt="userpic"
                />
            </div>
            <div className="p-fluid">
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>שם מלא</label>
                                <InputText id="2011" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={`${user?.firstName} ${user?.lastName}`} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>תאריך לידה</label>
                                <InputText id="2012" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={new Date(user?.birthDate).toDateString()} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>מ"א</label>
                                <InputText id="2013" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={user?.personalNumber} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>ת"ז</label>
                                <InputText id="2014" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={user?.identityCard} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>תק"ש</label>
                                <InputText id="2015" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={user?.dischargeDay} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>דרגה</label>
                                <InputText id="2016" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={user?.rank} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>היררכיה</label>
                                <InputText id="2017" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={user?.hierarchy} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>יוזר</label>
                                <InputText id="2018" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={user?.mail} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>תפקיד</label>
                                <InputText id="2020" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={user?.jobTitle} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>כתובת</label>
                                <InputText id="2021" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={user?.address} />
                            </div>
                        </div>
                <div className="p-fluid-item">
                            <div className="p-field">
                                <label>טלפון</label>
                                <InputText id="2022" type="text" disabled style={{opacity: 0.6,backgroundColor: '#f7f5fd', border: '1px solid #8390a9'}} placeholder={user?.mobilePhone[0]} />
                            </div>
                        </div>
            </div>
        </div>
    </Dialog>
);

export default FullUserInformationModal;
import blankProfilePic from '../../assets/images/blankProfile.png';
import { Tooltip } from 'primereact/tooltip';
import configStore from '../../store/Config';
import { ProgressSpinner } from 'primereact/progressspinner';
import '../../assets/css/local/pages/dashboard.css';
import { premissionsPopup } from '../../components/premissionsPopUp'
import { useState } from 'react';

const UserProfileCard = ({ isUserLoading, user, userTags, openFullDetailsModal }) => {
  let [visible, setVisible] = useState(false);
  return (
    <div className="personal-information-wrap">
      <div className="display-flex personal-information-inner">
        {isUserLoading ? (
          <ProgressSpinner className="tree-loading-spinner" />
        ) : (
          <>
            {userTags && userTags.length > 0 && (
              <div className="noticeRibbon">
                {userTags.length > 1 && (
                 <premissionsPopup userTags={userTags} visible={visible} onClick={(e) => { visible = setVisible(!visible) }}/>
                )}
                <div className="noticeText">
                  {userTags.length > 1 ? "הרשאות" : userTags.length > 0 && userTags[0]}

                  {userTags.length > 1 && <i className="tags-approver pi pi-angle-down p-mr-2"></i>}
                </div>
              </div>
            )}
            <div className="personal-information-item">
              <div className="userpic-wrap">
                <img
                  style={{ borderRadius: "50%" }}
                  src={
                    (user && user.picture) || user.picture !== configStore.USER_NO_PICTURE
                      ? `data:image/jpeg;base64,${user.picture}`
                      : blankProfilePic
                  }
                  alt="userpic"
                />
              </div>
            </div>
            <div className="personal-information-item">
              <dl>
                <dt>שם</dt>
                <dd>
                  {user?.firstName}
                  {user?.lastName ? " " + user.lastName : ""}
                </dd>
              </dl>
            </div>
            {user?.personalNumber ? (
              <div className="personal-information-item">
                <dl>
                  <dt>מ"א</dt>
                  <dd>{user.personalNumber}</dd>
                </dl>
              </div>
            ) : (
              user?.identityCard && (
                <div className="personal-information-item">
                  <dl>
                    <dt>ת"ז</dt>
                    <dd>{user?.identityCard}</dd>
                  </dl>
                </div>
              )
            )}
            <div className="personal-information-item">
              <dl>
                <dt>מייל</dt>
                <dd>
                  <a href={`mailto:${user?.mail}`} className="" title={user?.mail}>
                    {user?.mail}
                  </a>
                </dd>
              </dl>
            </div>
            <div className="personal-information-item">
              <dl>
                <dt>תפקיד</dt>
                <dd>{user?.jobTitle}</dd>
              </dl>
            </div>
            <div className="personal-information-item">
              <dl>
                <Tooltip target={`.hierarchy-name`} content={user?.hierarchy} position="top" />
                <dt>היררכיה</dt>
                <dd className="hierarchy-name cut-text"> {user?.hierarchy}</dd>
              </dl>
            </div>
            <div className="personal-information-item">
              <button
                className="btn-green-gradient btn-full-details"
                type="button"
                title="פרטים מלאים"
                onClick={openFullDetailsModal}
              >
                פרטים מלאים
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;

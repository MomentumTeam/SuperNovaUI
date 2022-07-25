import blankProfilePic from '../../assets/images/blankProfile.png';
import { Tooltip } from 'primereact/tooltip';
import configStore from '../../store/Config';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { useMatomo } from '@datapunt/matomo-tracker-react';

import '../../assets/css/local/pages/dashboard.css';

const UserProfileCard = ({
  isUserLoading,
  user,
  userTags,
  openFullDetailsModal,
  openPremissionsModal,
  isUserPremissionsModalOpen,
}) => {
  const { trackPageView } = useMatomo();
  const myPermissions = () => {
    trackPageView({
      documentTitle: 'ההרשאות שלי',
    });
  };

  const fullInformation = () => {
    trackPageView({
      documentTitle: 'פרטים מלאים',
    });
  };

  return (
    <div className="personal-information-wrap">
      <div className="display-flex personal-information-inner">
        {isUserLoading ? (
          <ProgressSpinner className="tree-loading-spinner" />
        ) : (
          <>
            <div className="personal-information-item">
              <div className="userpic-wrap">
                <img
                  style={{ borderRadius: '50%' }}
                  src={
                    (user && user.picture) ||
                    user.picture !== configStore.USER_NO_PICTURE
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
                  {user?.lastName ? ' ' + user.lastName : ''}
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
                  <a
                    href={`mailto:${user?.mail}`}
                    className=""
                    title={user?.mail}
                  >
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
                <Tooltip
                  target={`.hierarchy-name`}
                  content={user?.hierarchy}
                  position="top"
                />
                <dt>היררכיה</dt>
                <dd className="hierarchy-name cut-text"> {user?.hierarchy}</dd>
              </dl>
            </div>
            <div id={userTags.length > 0 ? 'userProfileCardButtons' : ''}>
              <div className="personal-information-item">
                <button
                  id="fullInformationButton"
                  className="btn-green-gradient btn-full-details"
                  type="button"
                  title="פרטים מלאים"
                  onClick={() => {
                    openFullDetailsModal();
                    fullInformation();
                  }}
                >
                  פרטים מלאים
                </button>
              </div>
              {userTags.length > 0 && (
                <div className="personal-information-item">
                  <Button
                    type="button"
                    label="ההרשאות שלי"
                    id="showPremissionsButton"
                    className="p-button-rounded p-button-warning"
                    onClick={() => {
                      openPremissionsModal();
                      myPermissions();
                    }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;

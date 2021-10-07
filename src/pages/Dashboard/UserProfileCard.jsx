import blankProfilePic from '../../assets/images/blankProfile.png';
import '../../assets/css/local/pages/dashboard.css';

const UserProfileCard = ({
  user,
  userPicture,
  userType,
  openFullDetailsModal
}) => (
  <div className="personal-information-wrap">
    <div className="display-flex personal-information-inner">
      {userType.tag && (
        <div className="confirms">
          <h3>{userType.tag}</h3>
        </div>
      )}
      <div className="personal-information-item">
        <div className="userpic-wrap">
          <img
            style={{ borderRadius: '50%' }}
            src={
              user && userPicture
                ? `data:image/jpeg;base64,${userPicture}`
                : blankProfilePic
            }
            alt="userpic"
          />
        </div>
      </div>
      <div className="personal-information-item">
        <dl>
          <dt>שם</dt>
          <dd>{`${user?.firstName} ${user?.lastName}`}</dd>
        </dl>
      </div>

      {user.rank != 'אזרח' && (
        <div className="personal-information-item">
          <dl>
            <dt>מ'א</dt>
            <dd>{user?.personalNumber}</dd>
          </dl>
        </div>
      )}

      {user.rank != 'אזרח' && (
        <div className="personal-information-item">
          <dl>
            <dt>מייל</dt>
            <dd>
              <a
                href="mailto:iron@dynaamic.com"
                className=""
                title="צלם מומחה1"
              >
                {user?.mail}
              </a>
            </dd>
          </dl>
        </div>
      )}

      {user.rank == 'אזרח' && (
        <div className="personal-information-item">
          <dl>
            <dt>ת"ז</dt>
            <dd> {user?.identityCard}</dd>
          </dl>
        </div>
      )}

      {user.rank != 'אזרח' && (
        <div className="personal-information-item">
          <dl>
            <dt>תפקיד</dt>
            <dd>
              <a href="#role" className="" title="צלם מומחה1">
                {user?.jobTitle}
              </a>
            </dd>
          </dl>
        </div>
      )}

      <div className="personal-information-item">
        <dl>
          <dt>היררכיה</dt>
          <dd> {user?.hierarchy}</dd>
        </dl>
      </div>

      {user.rank == 'אזרח' &&  user?.phone.length>0 &&(
        <div className="personal-information-item">
          <dl>
            <dt>מס' טלפון</dt>
            <dd> {user?.phone[0]}</dd>
          </dl>
        </div>
      )}

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
    </div>
  </div>
);

export default UserProfileCard;

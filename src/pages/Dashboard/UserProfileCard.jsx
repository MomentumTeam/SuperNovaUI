const UserProfileCard = ({ user }) => (
  <div className='personal-information-wrap'>
    <div className='display-flex personal-information-inner'>
      <div className='personal-information-item'>
        <div className='userpic-wrap'>
          <img
            src={
              user && user.picture
                ? `data:image/jpeg;base64,${user.picture}`
                : ''
            }
            alt='userpic'
          />
        </div>
      </div>
      <div className='personal-information-item'>
        <dl>
          <dt>שם</dt>
          <dd>{user?.firstName}</dd>
        </dl>
      </div>
      <div className='personal-information-item'>
        <dl>
          <dt>מ'א</dt>
          <dd>{user?.personalNumber}</dd>
        </dl>
      </div>
      <div className='personal-information-item'>
        <dl>
          <dt>מייל</dt>
          <dd>
            <a href='mailto:iron@dynaamic.com' className='' title='צלם מומחה1'>
              {user?.mail}
            </a>
          </dd>
        </dl>
      </div>
      <div className='personal-information-item'>
        <dl>
          <dt>תפקיד</dt>
          <dd>
            <a href='#role' className='' title='צלם מומחה1'>
              {user?.jobTitle}
            </a>
          </dd>
        </dl>
      </div>
      <div className='personal-information-item'>
        <dl>
          <dt>היררכיה</dt>
          <dd> {user?.hierarchy}</dd>
        </dl>
      </div>
      <div className='personal-information-item'>
        <button
          className='btn-green-gradient btn-full-details'
          type='button'
          title='פרטים מלאים'
        >
          פרטים מלאים
        </button>
      </div>
    </div>
  </div>
);

export default UserProfileCard;

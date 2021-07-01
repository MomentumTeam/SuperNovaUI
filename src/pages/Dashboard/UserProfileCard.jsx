const UserProfileCard = ({user}) => (
    <div className="personal-information-wrap">
        <div className="display-flex personal-information-inner">
            <div className="personal-information-item">
                <div className="userpic-wrap">
                    <img src={user?.picture} alt="userpic" />
                </div>
            </div>
            <div className="personal-information-item">
                <dl>
                    <dt>שם</dt>
                    <dd>{user?.firstName}</dd>
                </dl>
                <dl>
                    <dt>מ"א</dt>
                    <dd>{user}</dd>
                </dl>
            </div>
            <div className="personal-information-item">
                <dl>
                    <dt>תפקיד</dt>
                    <dd>
                        <a href="#role" className="" title="צלם מומחה1">
                            {user?.role}
                        </a>
                    </dd>
                </dl>
                <dl>
                    <dt>היררכיה</dt>
                    <dd>אמן <span>/</span> ספיר <span>/</span> צוותצילום <span>/</span> תכניתנית3
                    </dd>
                </dl>
            </div>
            <div className="personal-information-item">
                <dl>
                    <dt>טלפון</dt>
                    <dd className="no-wrap">{user?.phone}</dd>
                </dl>
                <dl>
                    <dt>תק"ש</dt>
                    <dd>{user?.endOfService}</dd>
                </dl>
            </div>
            <div className="personal-information-item">
                <dl>
                    <dt>מייל</dt>
                    <dd>
                        <a href="mailto:iron@dynaamic.com" className="" title="צלם מומחה1">
                            {user?.mail}
                        </a>
                    </dd>
                </dl>
                <dl>
                    <dt>כתובת</dt>
                    <dd>{user?.address}</dd>
                </dl>
            </div>
            <div className="personal-information-item">
                <button className="btn-green-gradient btn-full-details" type="button"
                    title="פרטים מלאים">
                    פרטים מלאים
                </button>
            </div>
        </div>
    </div>
);

export default UserProfileCard;
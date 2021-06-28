import { observer } from 'mobx-react'
import { useState, useEffect } from 'react';
import { useStores } from '../hooks/use-stores';
import Search from '../components/search';
import Chart from '../components/chart';
import Aside from '../components/aside';
import userpic from '../assets/images/userpic.png';
import '../assets/css/local/pages/dashboard.min.css';

const Dashboard = observer(() => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser({
            name: 'לירן עזרא',
            privateNumber: '45808006',
            role: 'צלם מומחה1',
            phone: '054-4769588',
            endOfService: '12/12/22',
            mail: 'iron@dynaamic.com',
            address: 'עליזה בגין 8 ראשלצ',
            picture: userpic
        })
    }, []);

    return (
        <>
            <div className="main-inner-item main-inner-item2">
                <div className="main-inner-item2-content">
                    <div className="display-flex title-wrap">
                        <h2>
                            פרטים אישיים
                        </h2>
                    </div>
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
                                    <dd>{user?.name}</dd>
                                </dl>
                                <dl>
                                    <dt>מ"א</dt>
                                    <dd>{user?.privateNumber}</dd>
                                </dl>
                            </div>
                            <div className="personal-information-item">
                                <dl>
                                    <dt>תפקיד</dt>
                                    <dd>
                                        <a href="#" className="" title="צלם מומחה1">
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
                <div className="content-unit-wrap">
                    <div className="content-unit-inner content-unit-inner-before">
                            <div className="search-row">
                                <div className="search-row-inner">
                                    <Search />
                                </div>
                            </div>
                            <div className="chart-wrap">
                                <Chart />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Aside/>
        </>
    )
});

export default Dashboard
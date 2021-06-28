import React from 'react';

import Serch from '../components/serch';
import Chart from '../components/chart';
import Aside from '../components/aside';

import '../assets/css/local/pages/dashboard.min.css';
import userpic from '../assets/images/userpic.png';

class Dashboard extends React.Component {


    render() {

        return (
            // 
            <React.Fragment>
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
                                        <img src={userpic} alt="userpic" />
                                    </div>
                                </div>
                                <div className="personal-information-item">
                                    <dl>
                                        <dt>שם</dt>
                                        <dd>לירן עזרא</dd>
                                    </dl>
                                    <dl>
                                        <dt>מ"א</dt>
                                        <dd>45808006</dd>
                                    </dl>
                                </div>
                                <div className="personal-information-item">
                                    <dl>
                                        <dt>תפקיד</dt>
                                        <dd>
                                            <a href="#" className="" title="צלם מומחה1">
                                                צלם מומחה1
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
                                        <dd className="no-wrap">054-4769588</dd>
                                    </dl>
                                    <dl>
                                        <dt>תק"ש</dt>
                                        <dd>12/12/22</dd>
                                    </dl>
                                </div>
                                <div className="personal-information-item">
                                    <dl>
                                        <dt>מייל</dt>
                                        <dd>
                                            <a href="mailto:iron@dynaamic.com" className="" title="צלם מומחה1">
                                                iron@dynaamic.com
                                            </a>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>כתובת</dt>
                                        <dd>עליזה בגין 8 ראשלצ</dd>
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
                                        <Serch />
                                    </div>
                                </div>
                                <div className="chart-wrap">

                                    <Chart />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <Aside></Aside>
            </React.Fragment>
        );
    }
}



export default Dashboard
import { observer } from 'mobx-react'
import { useState, useEffect } from 'react';
import Search from '../../components/search';
import Chart from '../../components/chart';
import Aside from '../../components/aside';
import userpic from '../../assets/images/userpic.png';
import '../../assets/css/local/pages/dashboard.min.css';
import UserProfileCard from './UserProfileCard';

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
                    <UserProfileCard user={user}/>
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
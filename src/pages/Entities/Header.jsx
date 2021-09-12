import { toJS } from 'mobx';
import { useEffect } from 'react';

import { useStores } from '../../context/use-stores';
import Norifications from '../../components/Notifications';

import '../../assets/css/main.css';

const Header = ({ setTab, selectedTab }) => {
    const { userStore } = useStores();
    const notifications = toJS(userStore.userNotifications);

    useEffect(() => {
        userStore.fetchUserNotifications(userStore.user?.id);
    }, [userStore]);

    return (
        <div className='display-flex title-wrap'>
            <div className='display-flex h-wrap' style={{ cursor: 'pointer' }}>
                <h3 style={{ color: selectedTab === 'entities' && '#201961' }} onClick={() => setTab('entities')}>
                    רשימת משתמשים
                </h3>
                <h3 style={{ color: selectedTab === 'hierarchy' && '#201961' }} onClick={() => setTab('hierarchy')}>
                    רשימת היררכיה
                </h3>
                <h3 style={{ color: selectedTab === 'roles' && '#201961' }} onClick={() => setTab('roles')}>
                    רשימת תפקידים
                </h3>
            </div>
            <Norifications notifications={notifications} />
        </div>
    );
};

export default Header;

import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import '../../assets/css/local/pages/listUsersPage.min.css';
import Table from '../../components/Table';
import { useStores } from '../../context/use-stores';
import Header from '../Entities/Header';
import SearchRequest from './SearchRequest';
import AddEntity from '../Entities/AddEntity';
import ApprovalTable from './MyRequestsTable'
import Footer from '../Entities/Footer';
import Notifications from '../../components/Notifications';

const MyRequests = observer(() => {
    const { tablesStore, userStore, appliesStore } = useStores();
    const [ tabId, setTabId ] = useState('entities');
    const notifications = toJS(userStore.userNotifications);
    const applies = toJS(appliesStore.myApplies);

    useEffect(() => {
        userStore.fetchUserNotifications(userStore.user?.id);
    }, [userStore]);

    useEffect(() => {
        if (tabId && userStore.user) {
            const userOGId = userStore.user.directGroup;
            
            switch(tabId) {
                case('entities'):
                tablesStore.loadEntitiesUnderOG(userOGId);
                    break;
                case('roles'):
                tablesStore.loadRolesUnderOG(userOGId);
                    break;
                case('hierarchy'):
                tablesStore.loadOGChildren(userOGId);
                    break;
                default:
                    break;
            }
        }
    }, [tabId, userStore, tablesStore])

    return (
        <>
            <div className='main-inner-item main-inner-item2 main-inner-item2-table'>
                <div className='main-inner-item2-content'>
                    <div className='display-flex title-wrap'>
                        <div className='display-flex h-wrap' style={{ cursor: 'pointer' }}>
                            <h3 style={{ color: '#201961' }}>
                                הבקשות שלי
                            </h3>
                        </div>
                        <Notifications notifications={notifications} />
                    </div>
                    <div className="content-unit-wrap">
                        <div className="content-unit-inner">
                            <div className="display-flex search-row-wrap-flex">
                                <SearchRequest data={toJS(tablesStore.entities)} />
                            </div>
                            <ApprovalTable applies={applies} />
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default MyRequests;

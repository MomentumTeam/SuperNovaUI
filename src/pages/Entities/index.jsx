import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import '../../assets/css/local/pages/listUsersPage.min.css';
import Table from '../../components/Table';
import { useStores } from '../../context/use-stores';
import Header from './Header';
import SearchEntity from './SearchEntity';
import AddEntity from './AddEntity';
import Footer from './Footer';

const Entities = observer(() => {
    const { tablesStore, userStore } = useStores();
    const [ tabId, setTabId ] = useState('entities');

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
                    <Header setTab={setTabId} selectedTab={tabId} />
                    <div className="content-unit-wrap">
                        <div className="content-unit-inner">
                            <div className="display-flex search-row-wrap-flex">
                                <SearchEntity data={toJS(tablesStore.entities)} />
                                <AddEntity />
                            </div>
                            <Table data={toJS(tablesStore.entities)} tableType={tabId} />
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default Entities;

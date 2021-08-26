import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import '../../assets/css/local/pages/listUsersPage.min.css';
import Table from '../../components/Table';
import { useStores } from '../../hooks/use-stores';
import Header   from './Header';
import SearchEntity from './SearchEntity';
import AddEntity from './AddEntity';
import Footer from './Footer';

const Entities = observer(() => {
    const { entityStore, userStore } = useStores();
    const [ tabId, setTabId ] = useState('entities');

    useEffect(() => {
        userStore.fetchUserNotifications(userStore.user?.id);
    }, [userStore])

    useEffect(() => {
        if(tabId && userStore.user) {
            const userOGId = userStore.user.directGroup;
            
            switch(tabId) {
                case('entities'):
                    entityStore.loadEntitiesByOG(userOGId);
                    break;
                case('roles'):
                    entityStore.loadRolesByOG(userOGId);
                    break;
                case('hierarchy'):
                    entityStore.loadHierarchyByOG(userOGId);
                    break;
                default:
                    break;
            }
        }
    }, [tabId, userStore, entityStore])

    return (
        <>
            <div className="main-inner-item main-inner-item2 main-inner-item2-table">
                <div className="main-inner-item2-content">
                    <Header setTab={setTabId} selectedTab={tabId} />
                    <div className="content-unit-wrap">
                        <div className="content-unit-inner">
                            <div className="display-flex search-row-wrap-flex">
                                <SearchEntity data={toJS(entityStore.entities)} />
                                <AddEntity />
                            </div>
                            <Table data={toJS(entityStore.entities)} tableType={tabId} />
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
    </>
  );
});

export default Entities;

import { useEffect } from 'react';
import { observer } from 'mobx-react';
import '../../assets/css/local/pages/listUsersPage.min.css';
import Table from '../../components/Table';
import { useStores } from '../../hooks/use-stores';
import Header   from './Header';
import SearchEntity from './SearchEntity';
import AddEntity from './AddEntity';
import Footer from './Footer';
import { toJS } from 'mobx';

const Entities = observer(() => {
    const { entityStore, userStore } = useStores();

    useEffect(() => {
        const userOGId = userStore.user?.directGroup;
        entityStore.loadEntitiesByOG(userOGId);

        userStore.fetchUserNotifications(userStore.user?.id);
    }, [entityStore, userStore.user]);

    return (
        <>
            <div className="main-inner-item main-inner-item2 main-inner-item2-table">
                <div>{}</div>
                <div className="main-inner-item2-content">
                    <Header notifications={toJS(userStore.userNotifications)} />
                    <div className="content-unit-wrap">
                        <div className="content-unit-inner">
                            <div className="display-flex search-row-wrap-flex">
                                <SearchEntity data={toJS(entityStore.entities)}/>
                                <AddEntity />
                            </div>
                            <Table data={toJS(entityStore.entities)}/>
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
    </>
  );
});

export default Entities;

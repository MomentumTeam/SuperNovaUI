import { useEffect, useState } from "react";
import { observer } from 'mobx-react';
import { pageSize } from "../../constants/api";

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
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);

    const setData = async (event) => {
        setIsLoading(true);

        if (tabId && userStore.user) {
            const userOGId = userStore.user.directGroup;

            let append; 
            if (event) append = true;

            switch (tabId) {
                case "entities":
                    await tablesStore.loadEntitiesUnderOG(userOGId, page, pageSize, append);
                    setTableData(tablesStore.entities);
                    break;
                case "roles":
                    await tablesStore.loadRolesUnderOG(userOGId, page, pageSize, append);
                    setTableData(tablesStore.roles);
                    break;
                case "hierarchy":
                    await tablesStore.loadOGChildren(userOGId, page, pageSize, append);
                    setTableData(tablesStore.groups);
                    break;
                default:
                    break;
                }
        }
        
        setPage(page+1);
        setIsLoading(false);
    };

    useEffect(() => {
        userStore.fetchUserNotifications(userStore.user?.id);
    }, [userStore]);

    useEffect(async() => {
        // Get table's data
        setPage(0);
        await setData();
    }, [tabId, userStore, tablesStore])


    return (
        <>
            <div className='main-inner-item main-inner-item2 main-inner-item2-table'>
                <div className='main-inner-item2-content'>
                    <Header setTab={setTabId} selectedTab={tabId} />
                    <div className="content-unit-wrap">
                        <div className="content-unit-inner">
                            <div className="display-flex search-row-wrap-flex">
                                <SearchEntity data={tableData} />
                                <AddEntity />
                            </div>
                            <Table data={tableData} tableType={tabId} isLoading={isLoading} onScroll={setData}/>
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default Entities;

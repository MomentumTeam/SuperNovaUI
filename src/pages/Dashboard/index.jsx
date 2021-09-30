import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useState, useEffect } from 'react';
import SearchBox from '../../components/SearchBox';
import HierarchyTree from '../../components/HierarchyTree';
import SideToolbar from '../../components/SideToolBar/SideToolbar';
import ApprovalTable from '../../components/ApprovalTable';
import '../../assets/css/local/pages/dashboard.min.css';
import UserProfileCard from './UserProfileCard';
import { useStores } from '../../context/use-stores';
import { USER_TYPE } from '../../constants';
import FullUserInformationModal from '../../components/Modals/FullUserInformationModal';
import ExampleTree from '../../components/tree';

const Dashboard = observer(() => {
    const { userStore, appliesStore, treeStore } = useStores();
    const [isFullUserInfoModalOpen, setIsFullUserInfoModalOpen] = useState(false);

    const user = toJS(userStore.user);
    const applies = toJS(appliesStore.applies);
    // const isUserApprovel = user?.type !== USER_TYPE.SOLDIER && user?.type !== USER_TYPE.UNRECOGNIZED;
    const isUserApprovel = false;

    useEffect(() => {
        if (userStore.user) {
            if (isUserApprovel) {
                // appliesStore.getCommanderApplies();
            } else {
                // appliesStore.loadApplies();
                treeStore.loadTreeByEntity(userStore.user);
            }
        }
    }, [userStore.user, appliesStore, treeStore]);

    const openFullDetailsModal = () => {
        setIsFullUserInfoModalOpen(true);
    };

    const closeFullDetailsModal = () => {
        setIsFullUserInfoModalOpen(false);
    };


    const data = [{"label":"Emelie","children":[{"label":"Hunter","children":[{"label":"Alba","children":[],"expanded":true},{"label":"Felicity","children":[],"expanded":true}],"expanded":true},{"label":"Orlando","children":[],"expanded":true}],"expanded":true}]
    console.log(JSON.stringify(toJS(treeStore.tree)))

    return (
        <>
            <div className='main-inner-item main-inner-item2'>
                <div className='main-inner-item2-content'>
                    <div className='display-flex title-wrap'>
                        <h2>פרטים אישיים</h2>
                    </div>
                    <UserProfileCard
                        user={user}
                        isUserApprovel={isUserApprovel}
                        openFullDetailsModal={openFullDetailsModal}
                    />
                    <FullUserInformationModal
                        user={user}
                        isOpen={isFullUserInfoModalOpen}
                        closeFullDetailsModal={closeFullDetailsModal}
                    />
                    <div className='content-unit-wrap'>
                        {isUserApprovel ? (
                            <ApprovalTable applies={applies} />
                        ) : (
                            <div className='content-unit-inner content-unit-inner-before'>
                                <div className='search-row'>
                                    <div className='search-row-inner'>
                                        <SearchBox
                                            loadDataByEntity={async (entity) => {
                                                await treeStore.loadTreeByEntity(entity);
                                            }}
                                            loadDataByOG={async (organizationGroup) => {
                                                await treeStore.loadTreeByOG(organizationGroup);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className='chart-wrap'>
                                    {/* <ExampleTree data={datta}/> */}
                                    <HierarchyTree data={data} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <SideToolbar recentApplies={toJS(appliesStore.applies)} />
        </>
    );
});

export default Dashboard;

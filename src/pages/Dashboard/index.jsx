import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useState, useEffect } from 'react';
import SearchBox from '../../components/SearchBox';
import HierarchyTree from '../../components/HierarchyTree';
import SideToolbar from '../../components/SideToolbar';
import AprovelTable from '../../components/AprovelTable';
import '../../assets/css/local/pages/dashboard.min.css';
import UserProfileCard from './UserProfileCard';
import { useStores } from '../../hooks/use-stores';
import { USER_TYPE } from '../../constants';
import FullUserInformationModal from '../../components/modals/FullUserInformationModal';

const Dashboard = observer(() => {
  const { userStore, appliesStore, treeStore } = useStores();
  const [isFullUserInfoModalOpen, setIsFullUserInfoModalOpen] = useState(false);

  const user = toJS(userStore.user);

  useEffect(() => {
    if (userStore.user) {
      appliesStore.loadApplies();
      treeStore.loadTreeByEntity(userStore.user);
    }
  }, [userStore.user, appliesStore, treeStore]);

  const openFullDetailsModal = () => {
    setIsFullUserInfoModalOpen(true);
  }

  const closeFullDetailsModal = () => {
    setIsFullUserInfoModalOpen(false);
  }

  return (
    <>
      <div className='main-inner-item main-inner-item2'>
        <div className='main-inner-item2-content'>
          <div className='display-flex title-wrap'>
            <h2>פרטים אישיים</h2>
          </div>
          <UserProfileCard user={user} isUserApprovel={user?.type !== USER_TYPE.SOLDIER && user?.type !== USER_TYPE.UNRECOGNIZED} openFullDetailsModal={openFullDetailsModal} />
          <FullUserInformationModal user={user} isOpen={isFullUserInfoModalOpen} closeFullDetailsModal={closeFullDetailsModal} />
          <div className='content-unit-wrap'>
          {user?.type === USER_TYPE.SOLDIER || user?.type === USER_TYPE.UNRECOGNIZED 
          ?
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
                <HierarchyTree data={toJS(treeStore.tree)} />
              </div>
            </div>
          : <AprovelTable />}
          </div>
        </div>
      </div>
      <SideToolbar
        recentApplies={toJS(appliesStore.applies)}
      />
    </>
  );
});

export default Dashboard;

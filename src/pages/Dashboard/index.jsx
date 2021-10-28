import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';

import '../../assets/css/local/pages/dashboard.min.css';

import { useStores } from '../../context/use-stores';
import SearchBox from '../../components/Search/SearchBox';
import HierarchyTree from '../../components/HierarchyTree';
import SideToolbar from '../../components/SideToolBar/SideToolbar';
import UserProfileCard from './UserProfileCard';
import FullEntityInformationModal from '../../components/Modals/Entity/FullEntityInformationModal';
import DecorAnimation from '../../components/decor-animation';
import { getUserTag, isUserCanSeeAllApproveApplies, isUserCanSeeMyApproveApplies } from '../../utils/user';
import { AppliesTable } from "../../components/AppliesTable";

const Dashboard = observer(() => {
  const { userStore, appliesStore, treeStore } = useStores();
  const [isFullUserInfoModalOpen, setIsFullUserInfoModalOpen] = useState(false);
  const toast = useRef(null);

  const user = toJS(userStore.user);
  const myApplies = toJS(appliesStore.myApplies);
  const approveMyApplies = toJS(appliesStore.approveMyApplies);
  const approveAllApplies = toJS(appliesStore.approveAllApplies);

  let userType;
  user?.types.map((type) => {userType = getUserTag(type)});

  const actionPopup = (error = null) => {
    if (error === null) {
      toast.current.show({
        severity: 'success',
        summary: 'Success Message',
        detail: `Success`,
        life: 3000,
      });
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error Message',
        detail: error.message || `failed`,
        life: 3000,
      });
    }
  };

  useEffect(() => {
    if (userStore.user) {
      if (isUserCanSeeMyApproveApplies(userStore.user)) {
        appliesStore.getMyApproveRequests(1,100);
      } 
      if (isUserCanSeeAllApproveApplies(userStore.user)) {
        appliesStore.getAllApproveRequests(1, 100);
      }
    } else {
      // appliesStore.loadApplies();
      treeStore.loadTreeByEntity(userStore.user);
    }
  }, [userStore.user, appliesStore, treeStore]);

  const openFullDetailsModal = () => {
    setIsFullUserInfoModalOpen(true);
  };

  const closeFullDetailsModal = () => {
    setIsFullUserInfoModalOpen(false);
  };

  return (
    <>
      <div className='main-inner-item main-inner-item2'>
        <div className='main-inner-item2-content'>
          <div className='display-flex title-wrap'>
            <h2>פרטים אישיים</h2>
          </div>
          <UserProfileCard
            user={user}
            userType={userType}
            openFullDetailsModal={openFullDetailsModal}
          />
          <FullEntityInformationModal
            user={user}
            isOpen={isFullUserInfoModalOpen}
            closeFullDetailsModal={closeFullDetailsModal}
            actionPopup={actionPopup}
          />
          <div className='content-unit-wrap'>
            {isUserCanSeeMyApproveApplies(user) ?  (
              <>
                <AppliesTable user={user} myApplies={approveMyApplies} allApplies={approveAllApplies}/>
              </>
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
                  <DecorAnimation />
                  <HierarchyTree data={toJS(treeStore.tree)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toast ref={toast} />
      <SideToolbar recentApplies={myApplies} />
    </>
  );
});

export default Dashboard;

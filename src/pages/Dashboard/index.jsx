import { observer } from "mobx-react";
import { toJS } from "mobx";
import { useState, useEffect } from "react";

import "../../assets/css/local/pages/dashboard.min.css";
import { useStores } from '../../context/use-stores';
import SearchBox from "../../components/Search/SearchBox";
import HierarchyTree from "../../components/HierarchyTree";
import SideToolbar from "../../components/SideToolBar/SideToolbar";
import UserProfileCard from "./UserProfileCard";
import FullEntityInformationModal from "../../components/Modals/Entity/FullEntityInformationModal";
import FullEntityPremissionsModal from "../../components/Modals/Entity/FullEntityPremissionsModal";

import DecorAnimation from "../../components/decor-animation";
import { getUserTags, isUserCanSeeAllApproveApplies, isUserCanSeeMyApproveApplies } from "../../utils/user";
import { AppliesTable } from "../../components/AppliesTable";
import { useToast } from '../../context/use-toast';

const Dashboard = observer(() => {
  const {actionPopup} = useToast();
  const { userStore, appliesStore, treeStore } = useStores();
  const [isFullUserInfoModalOpen, setIsFullUserInfoModalOpen] = useState(false);
  const [isUserPremissionsModalOpen, setIsUserPremissionsModalOpen] = useState(false);

  const user = toJS(userStore.user);
  const myApplies = toJS(appliesStore.myApplies);
  const approveMyApplies = toJS(appliesStore.approveMyApplies);
  const approveAllApplies = toJS(appliesStore.approveAllApplies);

  const userTags = getUserTags(user?.types);

  useEffect(() => {
    if (userStore.user) {
      if (!isUserCanSeeMyApproveApplies(userStore.user) && !isUserCanSeeAllApproveApplies(userStore.user)) {
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

  const openPremissionsModal = () => {
    setIsUserPremissionsModalOpen(true);

  };
  const closePremissionsModal = () => {
    setIsUserPremissionsModalOpen(false);

  };

  return (
    <>
      <div className="main-inner-item main-inner-item2">
        <div className="main-inner-item2-content">
          <div className="display-flex title-wrap">
            <h2>פרטים אישיים</h2>
          </div>
          <UserProfileCard
            isUserLoading={userStore.isUserLoading}
            user={user}
            userTags={userTags}
            openFullDetailsModal={openFullDetailsModal}
            openPremissionsModal={openPremissionsModal}
            isUserPremissionsModalOpen={isUserPremissionsModalOpen}
          />
          <FullEntityInformationModal
            user={user}
            isOpen={isFullUserInfoModalOpen}
            closeFullDetailsModal={closeFullDetailsModal}
            actionPopup={actionPopup}
            edit={false}
          />
          <FullEntityPremissionsModal
            user={user}
            isOpen={isUserPremissionsModalOpen}
            closePremissionsModal={closePremissionsModal}
            userTags={userTags}
          />
          
          <div className="content-unit-wrap">
            {isUserCanSeeMyApproveApplies(user) ? (
              <>
                <AppliesTable
                  user={user}
                  myApplies={approveMyApplies}
                  allApplies={approveAllApplies}
                />
              </>
            ) : (
              <div className="content-unit-inner content-unit-inner-before">
                <div className="search-row">
                  <div className="search-row-inner">
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
                <div className="chart-wrap">
                  <HierarchyTree
                    data={toJS(treeStore.tree)}
                    isTreeLoading={treeStore.isTreeLoading}
                  />
                  <DecorAnimation />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SideToolbar recentApplies={myApplies} />
    </>
  );
});

export default Dashboard;

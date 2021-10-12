import { observer } from "mobx-react";
import { toJS } from "mobx";
import { useState, useEffect } from "react";
import SearchBox from "../../components/SearchBox";
import HierarchyTree from "../../components/HierarchyTree";
import SideToolbar from "../../components/SideToolBar/SideToolbar";
import ApprovalTable from "../../components/ApprovalTable";
import "../../assets/css/local/pages/dashboard.min.css";
import UserProfileCard from "./UserProfileCard";
import { useStores } from "../../context/use-stores";
import { USER_TYPE, USER_TYPE_TAG } from "../../constants";
import FullUserInformationModal from "../../components/Modals/FullUserInformationModal";
import DecorAnimation from "../../components/decor-animation";

const Dashboard = observer(() => {
  const { userStore, appliesStore, treeStore } = useStores();
  const [isFullUserInfoModalOpen, setIsFullUserInfoModalOpen] = useState(false);

  const user = toJS(userStore.user);
  const userPicture = toJS(userStore.userPicture);
  const applies = toJS(appliesStore.myApplies);
  let userType;

  user?.types.forEach((type) => {
    switch (type) {
      case 5:
        userType = {
          type: USER_TYPE.ADMIN,
          tag: USER_TYPE_TAG.ADMIN
        };
        break;
      case 2:
        userType = {
          type: USER_TYPE.SUPER_SECURITY,
          tag: USER_TYPE_TAG.SECURITY_APPROVER,
        };
        break;
      case 1:
        userType = {
          type: USER_TYPE.SECURITY,
          tag: USER_TYPE_TAG.SECURITY_APPROVER,
        };
        break;
      case 3:
        userType = {
          type: USER_TYPE.COMMANDER,
          tag: USER_TYPE_TAG.APPROVER,
        };
        break;
      case 6:
        userType = { type: USER_TYPE.BULK };
        break;

      default:
        userType = { type: USER_TYPE.SOLDIER };
        break;
    }
  });

  useEffect(() => {
    if (userStore.user) {
      if (userType.type === USER_TYPE_TAG.COMMANDER) {
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

  return (
    <>
      <div className="main-inner-item main-inner-item2">
        <div className="main-inner-item2-content">
          <div className="display-flex title-wrap">
            <h2>פרטים אישיים</h2>
          </div>
          <UserProfileCard
            user={user}
            userPicture={userPicture}
            userType={userType}
            openFullDetailsModal={openFullDetailsModal}
          />
          <FullUserInformationModal
            user={user}
            userPicture={userPicture}
            isOpen={isFullUserInfoModalOpen}
            closeFullDetailsModal={closeFullDetailsModal}
          />
          <div className="content-unit-wrap">
            {userType.APPROVER ? (
              <ApprovalTable applies={applies} />
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
                  <DecorAnimation />
                  <HierarchyTree data={toJS(treeStore.tree)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <SideToolbar recentApplies={applies} />
    </>
  );
});

export default Dashboard;

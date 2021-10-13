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
import { USER_TYPE, USER_TYPE_TAG } from '../../constants';
import FullUserInformationModal from '../../components/Modals/FullUserInformationModal';

const Dashboard = observer(() => {
  const { userStore, appliesStore, treeStore } = useStores();
  const [isFullUserInfoModalOpen, setIsFullUserInfoModalOpen] = useState(false);

  const user = toJS(userStore.user);
  const userPicture = toJS(userStore.userPicture);
  const applies = toJS(appliesStore.applies);
  let userType;

  user?.types.forEach((type) => {
    switch (type) {
      case 'ADMIN':
      case 5:
        userType = {
          type: USER_TYPE.ADMIN,
          tag: USER_TYPE_TAG.ADMIN,
        };
        break;
      case 'SUPER_SECURITY':
      case 2:
        userType = {
          type: USER_TYPE.SUPER_SECURITY,
          tag: USER_TYPE_TAG.SECURITY_APPROVER,
        };
        break;
      case 'SECURITY':
      case 1:
        userType = {
          type: USER_TYPE.SECURITY,
          tag: USER_TYPE_TAG.SECURITY_APPROVER,
        };
        break;
      case 'COMMANDER':
      case 3:
        userType = {
          type: USER_TYPE.COMMANDER,
          tag: USER_TYPE_TAG.APPROVER,
        };
        break;
      case 'BULK':
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
      if (userType.type === USER_TYPE.COMMANDER) {
        appliesStore.getMyApproveRequests();
      } else {
        // appliesStore.loadApplies();
        treeStore.loadTreeByEntity(userStore.user);
      }
    }
  }, [userStore.user, appliesStore, treeStore, userType.type]);

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
          <div className='content-unit-wrap'>
            {userType.tag === USER_TYPE_TAG.APPROVER ? (
              <>
                <div className='display-flex title-wrap'>
                  <h2>בקשות לאישורי</h2>
                  <h3>{applies.length} סה"כ</h3>
                  {console.log(applies)}
                </div>
                <ApprovalTable applies={applies} />
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

import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useState, useEffect } from 'react';
import SearchBox from '../../components/SearchBox';
import HierarchyTree from '../../components/HierarchyTree';
import SideToolbar from '../../components/SideToolbar';
import '../../assets/css/local/pages/dashboard.min.css';
import UserProfileCard from './UserProfileCard';
import { useStores } from '../../hooks/use-stores';
import {
  getMyNotifications,
  markAsRead,
} from '../../service/NotificationService';

const Dashboard = observer(() => {
  const [messagesList, setMessagesList] = useState([]);
  const { userStore, countryStore, appliesStore, treeStore } = useStores();

  getMyNotifications();

  useEffect(() => {
    countryStore.loadContries();

    setMessagesList([
      {
        id: '1',
        date: '28/05/21',
        description: 'בקשה ליצירת תפקיד חדש',
        status: 'נשלחה',
      },
      {
        id: '2',
        date: '28/05/21',
        description: 'בקשה לשינוי היררכיה',
        status: 'נשלחה',
      },
      {
        id: '3',
        date: '28/05/21',
        description: 'בקשה למעבר תפקיד',
        status: 'נדחתה',
      },
      {
        id: '4',
        date: '28/05/21',
        description: 'btn-actions',
        status: 'נדחתה',
      },
    ]);
  }, [countryStore]);

  useEffect(() => {
    if (userStore.user) {
      appliesStore.loadApplies();
      treeStore.loadTreeByEntity(userStore.user);
    }
  }, [userStore.user, appliesStore, treeStore]);

  useEffect(() => {
    if (userStore.user) {
      console.log('yes!!');
      console.log(toJS(userStore.user));
      appliesStore.loadApplies();
    }
  }, [userStore.user, appliesStore]);

  return (
    <>
      <div className='main-inner-item main-inner-item2'>
        <div className='main-inner-item2-content'>
          <div className='display-flex title-wrap'>
            <h2>פרטים אישיים</h2>
          </div>
          <UserProfileCard user={toJS(userStore.user)} />
          <div className='content-unit-wrap'>
            <div className='content-unit-inner content-unit-inner-before'>
              <div className='search-row'>
                <div className='search-row-inner'>
                  <SearchBox
                    loadDataByEntity={async (entity) => {
                      await treeStore.loadTreeByEntity(entity);
                    }}
                    loadDataByOG={async (entity) => {
                      await treeStore.loadTreeByOG(entity);
                    }}
                  />
                </div>
              </div>
              <div className='chart-wrap'>
                <HierarchyTree data={toJS(treeStore.tree)} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SideToolbar
        recentApplies={toJS(appliesStore.applies)}
        lastMessages={messagesList}
      />
    </>
  );
});

export default Dashboard;

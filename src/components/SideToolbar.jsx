import { useEffect } from 'react';
import { toJS } from 'mobx';

import Toolbar from './Toolbar';
import Actions from '../components/Actions';
import List from './List';
import Notifications from '../components/Notifications';
import { useStores } from '../hooks/use-stores';
import '../assets/css/local/components/aside.min.css';

const SideToolbar = ({ recentApplies }) => {
  const { userStore } = useStores();
  const notifications = toJS(userStore.userNotifications)

  useEffect(() => {
    userStore.fetchUserNotifications(userStore.user?.id);
  }, [userStore]);

  return (
  <div className='main-inner-item main-inner-item3'>
    <div className='main-inner-item3-content'>
      <Notifications notifications={notifications} />
      <div className='actions-inner-wrap'>
        <h2>פעולות</h2>
        <Actions />
      </div>
      <div className='requests-inner-wrap'>
        <div className='display-flex title-wrap'>
          <h2>בקשות שלי</h2>
          <a href='#all' title='הכל - נפתך בחלון חדש'>
            הכל
          </a>
        </div>
        <div className='table-item-wrap'>
          <div className='table-item-inner'>
            <List list={recentApplies}/>
          </div>
        </div>
      </div>
    </div>
  </div>
)};

export default SideToolbar;

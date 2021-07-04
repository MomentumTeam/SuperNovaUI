import { observer } from 'mobx-react';
import { toJS } from 'mobx';
import { useState, useEffect } from 'react';
import SearchBox from '../../components/SearchBox';
import HierarchyTree from '../../components/HierarchyTree';
import SideToolbar from '../../components/SideToolbar';
import userpic from '../../assets/images/userpic.png';
import '../../assets/css/local/pages/dashboard.min.css';
import UserProfileCard from './UserProfileCard';
import { useStores } from '../../hooks/use-stores';

const Dashboard = observer(() => {
    const [user, setUser] = useState(null);
    const [messagesList, setMessagesList] = useState([]);
    const { countryStore, appliesStore, treeStore } = useStores();

    useEffect(() => {
        countryStore.loadContries();
        appliesStore.loadApplies();
        treeStore.loadTree('111');

        setMessagesList([
            { id: "1", date: "28/05/21", description: "בקשה ליצירת תפקיד חדש", status: "נשלחה" },
            { id: "2", date: "28/05/21", description: "בקשה לשינוי היררכיה", status: "נשלחה" },
            { id: "3", date: "28/05/21", description: "בקשה למעבר תפקיד", status: "נדחתה" },
            { id: "4", date: "28/05/21", description: "btn-actions", status: "נדחתה" },
        ])
        setUser({
            name: 'לירן עזרא',
            privateNumber: '45808006',
            role: 'צלם מומחה1',
            phone: '054-4769588',
            endOfService: '12/12/22',
            mail: 'iron@dynaamic.com',
            address: 'עליזה בגין 8 ראשלצ',
            picture: userpic
        });

    }, [appliesStore, countryStore, treeStore]);

  return (
    <>
      <div className='main-inner-item main-inner-item2'>
        <div className='main-inner-item2-content'>
          <div className='display-flex title-wrap'>
            <h2>פרטים אישיים</h2>
          </div>
          <UserProfileCard user={user} />
          <div className='content-unit-wrap'>
            <div className='content-unit-inner content-unit-inner-before'>
              <div className='search-row'>
                <div className='search-row-inner'>
                  <SearchBox data={toJS(countryStore.countries)} />
                </div>
              </div>
              <div className='chart-wrap'>
                <HierarchyTree data={toJS(treeStore.tree)} />
              </div>
            </div>
            </div>
        </div>
      </div>
      <SideToolbar recentApplies={toJS(appliesStore.applies)} lastMessages={messagesList}/>
    </>
  )
});

export default Dashboard;

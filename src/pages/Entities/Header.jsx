import { useRef } from 'react';
import { Badge } from 'primereact/badge';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import "../../assets/css/main.css";

const Header = ({notifications, setTab, selectedTab}) => {
  const op = useRef(null);

  return (
    <div className='display-flex title-wrap'>
    <div className='display-flex h-wrap' style={{cursor: 'pointer'}}>
      <h3 style={{color: selectedTab === 'entities' && '#201961'}} onClick={() => setTab('entities')}>רשימת משתמשים</h3>
      <h3 style={{color: selectedTab === 'hierarchy' && '#201961'}} onClick={() => setTab('hierarchy')}>רשימת היררכיה</h3>
      <h3 style={{color: selectedTab === 'roles' && '#201961'}} onClick={() => setTab('roles')}>רשימת תפקידים</h3>
    </div>
      <div className='display-flex display-flex-end btns-wrap'>
        <button
          className='btn btn-notification p-mr-4'
          title='Notification'
          type='button'
          onClick={(e) => op.current.toggle(e)}
        >
          {
            notifications?.length > 0 &&
            <Badge
              value={notifications.length}
              style={{position: 'relative', top: '1.2rem', left: '1.2rem'}}
            />
          }
        </button>
        <OverlayPanel ref={op} id="overlay_panel" style={{width: '450px'}} className="overlaypanel-demo">
          <DataTable value={notifications} selectionMode="single" paginator rows={5} paginatorClassName="notificationPaginator">
              <Column field="type" header="סוג" />
              <Column field="message" header="תוכן" />
              <Column field="reason" header="סיבה" />
          </DataTable>
        </OverlayPanel>
        <button className='btn btn-humburger' title='Humburger' type='button'>
          <span className='for-screnReader'>Humburger</span>
        </button>
      </div>
    </div>
  )
};

export default Header;

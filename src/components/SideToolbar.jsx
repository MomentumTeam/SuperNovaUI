/** @format */

import Toolbar from './Toolbar';
import List from './List';

import '../assets/css/local/components/aside.min.css';

const SideToolbar = ({ lastRequests, lastMessages }) => (
  <div className='main-inner-item main-inner-item3'>
    <div className='main-inner-item3-content'>
      <div className='display-flex display-flex-end btns-wrap'>
        <button
          className='btn btn-notification'
          title='Notification'
          type='button'
        >
          <span className='for-screnReader'>Notification</span>
        </button>
        <button className='btn btn-humburger' title='Humburger' type='button'>
          <span className='for-screnReader'>Humburger</span>
        </button>
      </div>
      <div className='actions-inner-wrap'>
        <h2>פעולות</h2>
        <Toolbar />
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
            <List list={lastRequests} />
          </div>
        </div>
      </div>
      <div className='messages-inner-wrap'>
        <div className='display-flex title-wrap'>
          <h2>הודעות</h2>
          <a href='#all' title='הכל - נפתך בחלון חדש'>
            הכל
          </a>
        </div>
        <div className='table-item-wrap'>
          <div className='table-item-inner'>
            <List list={lastMessages} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SideToolbar;

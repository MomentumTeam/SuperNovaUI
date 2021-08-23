const Header = ({setTab, selectedTab}) => (
  <div className='display-flex title-wrap'>
    <div className='display-flex h-wrap' style={{cursor: 'pointer'}}>
      <h3 style={{color: selectedTab === 'entities' && '#201961'}} onClick={() => setTab('entities')}>רשימת משתמשים</h3>
      <h3 style={{color: selectedTab === 'hierarchy' && '#201961'}} onClick={() => setTab('hierarchy')}>רשימת היררכיה</h3>
      <h3 style={{color: selectedTab === 'roles' && '#201961'}} onClick={() => setTab('roles')}>רשימת תפקידים</h3>
    </div>
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
  </div>
);

export default Header;

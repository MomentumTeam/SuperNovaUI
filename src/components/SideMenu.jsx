import { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';
import '../assets/css/local/components/menu.min.css';
import { Link } from 'react-router-dom';

const SideMenu = () => {
  const [pageClicked, setPageClicked] = useState('menu1');

  useEffect(() => {
    if (window.location.pathname === '/listUsersPage') setPageClicked('menu5');
  }, []);

  const toggleMenu = (type) => (event) => {
    setPageClicked(type);
  };

  return (
    <div className='main-inner-item main-inner-item-nav'>
      <nav>
        <ul>
          <li>
            <Link
              className={
                'aside-item-btn aside-item-btn1 ' +
                (pageClicked === 'menu1' ? 'active' : '')
              }
              onClick={toggleMenu('menu1')}
              title='Home'
              to='/'
            >
              <span className='for-screnReader'>Home</span>
            </Link>
          </li>
          <li>
            <Link
              className={
                'aside-item-btn aside-item-btn5 ' +
                (pageClicked === 'menu5' ? 'active' : '')
              }
              onClick={toggleMenu('menu5')}
              title='Home'
              to='/listUsersPage'
            >
              <span className='for-screnReader'>Home</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <div className='logo-wrap'>
          <h1>
            <img src={logo} alt='Logo יסודות' />
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;

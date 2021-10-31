import '../../assets/css/local/components/menu.min.css';
import legoLogo from '../../assets/images/lego.png';
import appRoutes from '../../constants/routes';
import { NavLink } from 'react-router-dom';

const SideMenu = () => {
  const getNavButton = (menuItem, i) => {
    if (menuItem.label) {
      return (
        <li key={i}>
          <NavLink
            to={menuItem.path}
            className={`aside-item-btn ${menuItem.classIcon}`}
            activeClassName={`aside-item-btn ${menuItem.classIcon} active`}
            exact
          >
            <span className='for-screnReader'>{menuItem.label}</span>
          </NavLink>
        </li>
      );
    }
  };

  return (
    <div className='main-inner-item main-inner-item-nav'>
      <div className="logo-wrap">
          <h1>
            <img src={legoLogo} alt="Logo יסודות" />
          </h1>
        </div>
      <nav>
        <ul>{appRoutes.map((menuItem, i) => getNavButton(menuItem, i))}</ul>
      </nav>
      <div>
          <div className="logo-wrap2">
            <div className="logo"></div>
          </div>
        </div>
    </div>
  );
};

export default SideMenu;

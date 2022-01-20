import '../../assets/css/local/components/menu.min.css';
import legoLogo from '../../assets/images/lego.png';
import appRoutes from '../../constants/routes';
import { NavLink } from 'react-router-dom';
import { useStores } from '../../context/use-stores';
import { USER_TYPE } from '../../constants';

const SideMenu = () => {
  const { userStore } = useStores();
  const userTypes = userStore.user?.types ? userStore.user.types : USER_TYPE.SOLDIER;
  
  const getNavButton = (menuItem, i) => {
    if (menuItem.label) {
      return (
        <li key={i} title={menuItem.label}>
          <NavLink
            to={menuItem.path}
            className={`aside-item-btn ${menuItem.classIcon}`}
            activeClassName={`aside-item-btn ${menuItem.classIcon} active`}
            exact
          >
            <span className="for-screnReader">{menuItem.label}</span>
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
        <ul>{appRoutes.map((menuItem, i) => {
          if (!menuItem?.roles || menuItem.roles.some((role) => userTypes.includes(role)))
            return getNavButton(menuItem, i);
        })}</ul>
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

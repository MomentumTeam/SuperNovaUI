import Dashboard from '../pages/Dashboard';
import ListUsersPage from '../pages/Entities';

const appRoutes = [
  {
    path: '/',
    classIcon: 'aside-item-btn1',
    label: 'Home',
    component: Dashboard,
  },
  {
    path: '/listUsersPage',
    classIcon: 'aside-item-btn5',
    label: 'Home',
    component: ListUsersPage,
  },
];

export default appRoutes;

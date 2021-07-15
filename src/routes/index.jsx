import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MainLayout from '../layouts/Main';
import Dashboard from '../pages/Dashboard';
import ListUsersPage from '../pages/Entities';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import { useQuery } from '../hooks/use-query';
import { useStores } from '../hooks/use-stores';

const RouteMainLayoutWrapper = ({ component: Component, ...rest }) => {
  return (
    <ProtectedRoute>
      <Route
        {...rest}
        render={(props) => (
          <MainLayout {...props}>
            <Component {...props} />
          </MainLayout>
        )}
      />
    </ProtectedRoute>
  );
};

const AppRouter = () => {
  const { token, id } = useQuery();
  const { userStore } = useStores();
  console.log(id)
  console.log(userStore.user);
  console.log(token);
  if (!userStore.user && token) {
    localStorage.setItem('token', token);
    localStorage.setItem('id', id);
    userStore.fetchUserInfo(id);
  } else if (localStorage.getItem('id')) {
    const id = localStorage.getItem('id');
    userStore.fetchUserInfo(id);
  }

  return (
    <BrowserRouter>
      <Switch>
        <RouteMainLayoutWrapper path='/' component={Dashboard} exact />
        <RouteMainLayoutWrapper
          path='/listUsersPage'
          component={ListUsersPage}
          exact
        />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;

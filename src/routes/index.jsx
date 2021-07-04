/** @format */

import { BrowserRouter, Route, Switch } from 'react-router-dom';

import MainLayout from '../layouts/Main';
import Dashboard from '../pages/Dashboard';
import ListUsersPage from '../pages/Entities';
import NotFound from '../pages/NotFound';

const RouteMainLayoutWrapper = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (
        <MainLayout {...props}>
          <Component {...props} />
        </MainLayout>
      )}
    />
  );
};

const AppRouter = () => {
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

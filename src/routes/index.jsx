import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/Main';
import Dashboard from '../pages/Dashboard';
import ListUsersPage from '../pages/Entities';
import NotFound from '../pages/NotFound';
import { useQuery } from '../hooks/use-query';

const RouteMainLayoutWrapper = ({
  component: Component,
  ...rest
}) => {
  return (
    <Route {...rest} render={(props) =>
      <MainLayout {...props}>
        <Component {...props} />
      </MainLayout>
    } />
  );
}

const AppRouter = () => {
  return (
    <BrowserRouter>
        <Switch>
          <ProtectedRoute>
            <RouteMainLayoutWrapper path='/' component={Dashboard} exact />
          </ProtectedRoute>
          <ProtectedRoute>
            <RouteMainLayoutWrapper path='/listUsersPage' component={ListUsersPage} exact />
          </ProtectedRoute>
            <Route component={NotFound}/>
        </Switch>
    </BrowserRouter>
  );
}

export default AppRouter;
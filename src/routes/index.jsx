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
    <ProtectedRoute>
      <Route {...rest} render={(props) =>
        <MainLayout {...props}>
          <Component {...props} />
        </MainLayout>
      } />
    </ProtectedRoute>
  );
}

const AppRouter = () => {
  const { token } = useQuery();

    if(token) {
      localStorage.setItem('token', token);
    }

  return (
    <BrowserRouter>
        <Switch>
          <RouteMainLayoutWrapper path='/' component={Dashboard} exact />
          <RouteMainLayoutWrapper path='/listUsersPage' component={ListUsersPage} exact />
          <Route component={NotFound}/>
        </Switch>
    </BrowserRouter>
  );
}

export default AppRouter;
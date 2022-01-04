import React, { useEffect } from 'react';
import appRoutes from '../constants/routes';
import NotFound from '../pages/NotFound';
import ProtectedRouteWrapper from './ProtectedRouteWrapper';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useStores } from '../context/use-stores';

let routePaths = [];

const routeGenerator = (routes) => {
  routes.map((route) => {
    switch (route.path) {
      case '/':
        routePaths.push(
          <ProtectedRouteWrapper
            path={route.path}
            component={route.component}
            exact
          />
        );
        break;
      default:
        routePaths.push(
          <ProtectedRouteWrapper
            path={route.path}
            roles={route.roles}
            component={() => <route.component {...route.componentParams} />}
          />
        );
        break;
    }
  });
};
routeGenerator(appRoutes);

const AppRouter = () => {
  const { userStore } = useStores();

  useEffect(async () => {
    await userStore.fetchUserInfo();
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        {routePaths}
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;

import React, { useEffect } from 'react';
import appRoutes from '../constants/routes';
import NotFound from '../pages/Errors/NotFound';
import ProtectedRouteWrapper from './ProtectedRouteWrapper';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useStores } from '../context/use-stores';
import Error503 from '../pages/Errors/503';
import healthStore from '../store/Health';

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
    await healthStore.loadHealth();
    await userStore.fetchUserInfo();
  }, [healthStore.isApiHealthy]);

  return (
    <BrowserRouter>
      <Switch>
        {routePaths}
        <Route component={Error503} path="/503" />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;

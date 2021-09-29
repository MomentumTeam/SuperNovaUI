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
                routePaths.push(<ProtectedRouteWrapper path={route.path} component={route.component} exact />);
                break;
            default:
                routePaths.push(
                    <ProtectedRouteWrapper
                        path={route.path}
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

    if (!userStore.user) {
        userStore.setUserInfo();
    }

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

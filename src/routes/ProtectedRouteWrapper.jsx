import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/Main';
import { Route } from 'react-router-dom';

const ProtectedRouteWrapper = ({ component: Component, ...rest }) => {
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

export default ProtectedRouteWrapper;

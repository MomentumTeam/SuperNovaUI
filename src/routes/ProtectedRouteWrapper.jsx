import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/Main';
import { Route, Redirect } from 'react-router-dom';
import { useStores } from '../context/use-stores';
import { USER_TYPE } from '../constants';

const ProtectedRouteWrapper = ({ component: Component, roles, ...rest }) => {
  const { userStore } = useStores();
  const userTypes = userStore.user?.types? userStore.user.types: USER_TYPE.SOLDIER;
  
  return (
    <ProtectedRoute>
      <Route
        {...rest}
        render={(props) => {return roles && !roles.some((role) => userTypes.includes(role)) ? (
          <Redirect to={{ pathname: "/" }} />
        ) : (
          <MainLayout {...props}>
            <Component {...props} />
          </MainLayout>
        );
        }}
      />
    </ProtectedRoute>
  );
};

export default ProtectedRouteWrapper;

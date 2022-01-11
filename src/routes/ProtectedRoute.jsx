import cookies from 'js-cookie';
import { Route } from 'react-router-dom';
import { apiBaseUrl } from '../constants/api';
import configStore from '../store/Config';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = cookies.get(configStore.TOKEN_NAME);

  if (!token) {
    window.location.replace(`${apiBaseUrl}/auth/login`);
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;

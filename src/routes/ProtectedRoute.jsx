import cookies from 'js-cookie';
import { Route } from 'react-router-dom';
import { apiBaseUrl } from '../constants/api';
import { tokenName } from '../constants/api';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = cookies.get(tokenName);

  if (!token) {
    window.location.replace(`${apiBaseUrl}/auth/login`);
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;

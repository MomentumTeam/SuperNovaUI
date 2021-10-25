import { Route } from 'react-router-dom';
import { toJS } from 'mobx';

import { apiBaseUrl } from '../constants/api';
import { useStores } from '../context/use-stores';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { userStore } = useStores();
    const user = toJS(userStore.user);
    
  if (!user) {
    window.location.replace(`${apiBaseUrl}/auth/login`);
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;

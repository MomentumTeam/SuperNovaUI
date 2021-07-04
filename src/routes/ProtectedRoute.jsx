import { Route } from 'react-router-dom';
import { apiBaseUrl } from '../constants/api';

const ProtectedRoute = ({
    component: Component,
    ...rest
  }) => {
    const token = localStorage.getItem('token');
  
    if(!token) {
        window.location.href = `${apiBaseUrl}/api/auth/login`;
        return <div/>;
    }

    return (
        <Route {...rest} render={(props) => 
            <Component {...props} />
            }
        />
    );
}
  
export default ProtectedRoute;
  


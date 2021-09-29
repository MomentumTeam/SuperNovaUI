import cookies from 'js-cookie';
import { Route } from 'react-router-dom';
import { apiBaseUrl, tokenName } from '../constants/api';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const token = cookies.get(tokenName);

    if (!token) {
        window.location.href = `${apiBaseUrl}/auth/login`;
        return <div />;
    }

    return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;

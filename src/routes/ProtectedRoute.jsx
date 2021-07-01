
import { Route } from 'react-router-dom';
import axiosApiInstance from '../config/axios';
import { useStores } from '../hooks/use-stores';


const ProtectedRoute = ({
    component: Component,
    ...rest
  }) => {
    const token = localStorage.getItem('token');
    const userID = "507f1f77bcf86cd799439011";

    const { userStore } = useStores();
    if(!token) {
        window.location.href = "http://localhost:2000/api/auth/login";
        return;
    }
    else {
        await userStore.setUser(userID);
    }

    return (
        <Route {...rest} render={(props) => 
            <Component {...props} />
            }
        />
    );
}
  
export default ProtectedRoute;
  


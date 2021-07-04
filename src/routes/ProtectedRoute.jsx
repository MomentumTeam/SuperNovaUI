
import { Route } from 'react-router-dom';


const ProtectedRoute = ({
    component: Component,
    ...rest
  }) => {
    const token = localStorage.getItem('token');
  
    if(!token) {
        window.location.href = "http://localhost:2000/api/auth/login";
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
  


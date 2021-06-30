
import './App.css';
import './assets/css/main.min.css';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useEffect } from 'react'; 
import { getCookie } from 'react-use-cookie';

import { StoreProvider } from './store';
import AppRouter from './routes';

const App = () => {
  const token = getCookie('ppp');

  useEffect(() => {
    if(!token) {
      window.location.href = "http://localhost:9000/auth/login";
    }
  }, [])

  return (
    token && 
    <StoreProvider>
      <div className="display-flex main-inner-wrap">
        <AppRouter/>
      </div>
    </StoreProvider>
  )
}

export default App;
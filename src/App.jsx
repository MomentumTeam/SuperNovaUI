import './App.css';
import './assets/css/main.min.css';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { StoreProvider } from './store';
import { ToastProvider} from './store/Toast';
import AppRouter from './routes';
import { ToastAlert } from './components/ToastAlert';

const App = () => {
  return (
    <StoreProvider>
      <ToastProvider>
        <ToastAlert/>
      <div className="display-flex main-inner-wrap">
        <AppRouter />
      </div>
     </ToastProvider>
    </StoreProvider>
  );
};

export default App;

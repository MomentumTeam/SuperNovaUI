
import './App.css';
import './assets/css/main.min.css';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { StoreProvider } from './store';
import AppRouter from './routes';

const App = () => {

  return (
    <StoreProvider>
      <div className="display-flex main-inner-wrap">
        <AppRouter/>
      </div>
    </StoreProvider>
  )
}

export default App;

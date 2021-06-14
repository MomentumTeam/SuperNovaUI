import logo from './logo.png';
import './App.css';
import './assets/css/main.min.css';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Dashboard from './pages/dashboard';
import Menu from './components/menu';


import { InputText } from 'primereact/inputtext'

function App() {
  return (
    <div className="display-flex main-inner-wrap">
      {/* <header className="App-header">
        
      </header> */}
      <Menu />
      <Dashboard />
    </div>
  );
}

export default App;

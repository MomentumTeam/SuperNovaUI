
import './App.css';
import './assets/css/main.min.css';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Dashboard from './pages/dashboard';
import listUsersPage from './pages/listUsersPage';
import Menu from './components/menu';

import React from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


class App extends React.Component {




  render() {
    return (
      <Router>
        <div className="display-flex main-inner-wrap">
          <Menu />
          <Switch>
            <Route path="/" component={Dashboard} exact />
            <Route path="/listUsersPage" component={listUsersPage} exact />
          </Switch>
        </div>
      </Router >
    )
  };



}

export default App;

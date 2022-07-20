import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';
import './index.css';
import {matomoUrl, matomoSiteId} from './constants/matomo';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

const instance = createInstance({
  urlBase: matomoUrl,
  siteId: matomoSiteId,
});
ReactDOM.render(
  <MatomoProvider value={instance}>
    <App />
  </MatomoProvider>, document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

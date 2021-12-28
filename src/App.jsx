import './App.css';
import './assets/css/main.min.css';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import React, { Suspense } from 'react';
import { StoreProvider } from './store';
import { ToastProvider } from './store/Toast';
import { ToastAlert } from './components/ToastAlert';
import Loading from './Loading';

const AppRouter = React.lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import('./routes')), 2500);
  });
});

const App = () => {
  return (
    <StoreProvider>
      <ToastProvider>
        <ToastAlert />
        <div className="display-flex main-inner-wrap">
          <Suspense fallback={<Loading />}>
            <AppRouter />
          </Suspense>
        </div>
      </ToastProvider>
    </StoreProvider>
  );
};

export default App;

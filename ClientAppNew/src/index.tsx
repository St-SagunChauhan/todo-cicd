import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { GlobalProvider } from 'context/GlobalContext';
import store from 'stores';
import 'locales/i18n';
import initRequest from 'services/initRequest';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import App from './App';

import './index.css';
import reportWebVitals from './reportWebVitals';

initRequest(store);

const rootElement: any = document.getElementById('root');
const root: any = createRoot(rootElement);
root.render(
  <Provider store={store}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </LocalizationProvider>
  </Provider>,
);
reportWebVitals();

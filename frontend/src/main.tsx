import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { Toaster } from 'react-hot-toast';
import { AppRoutes } from './routes/AppRoutes';
import { antdTheme } from './theme/antdTheme';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={antdTheme}>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1A1A1A',
            boxShadow: '0 2px 8px rgba(30, 136, 229, 0.1)',
            borderRadius: '0.5rem',
            padding: '1rem',
          },
          success: {
            iconTheme: {
              primary: '#43A047',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#C62828',
              secondary: '#fff',
            },
          },
        }}
      />
    </ConfigProvider>
  </React.StrictMode>,
);

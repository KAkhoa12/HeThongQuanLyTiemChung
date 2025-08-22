import { useEffect, useState, Suspense } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import routes from './routes/routes';
import Loader from './common/Loader';

function App() {
  const content = useRoutes(routes);

  return (
    <Suspense fallback={<Loader />}>
      {content}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#04b20c',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#e13f32',
              secondary: '#fff',
            },
          },
        }}
      />
    </Suspense>
  );
}

export default App;
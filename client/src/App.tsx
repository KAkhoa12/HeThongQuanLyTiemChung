import { useEffect, useState, Suspense } from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import routes from './routes/routes';
import Loader from './common/Loader';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  
  // Use the routes configuration from routes.tsx
  const content = useRoutes(routes);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Suspense fallback={<Loader />}>
      {content}
    </Suspense>
  );
}

export default App;
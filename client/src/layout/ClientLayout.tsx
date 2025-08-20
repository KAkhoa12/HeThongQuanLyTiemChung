import { Outlet } from 'react-router-dom';
import Header from '../components/Header/MainPage/index';
import Footer from '../components/Footer/MainPage';

const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );  
};

export default ClientLayout;
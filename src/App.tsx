import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {
  return (

    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
    </div>

  );
}

export default App;

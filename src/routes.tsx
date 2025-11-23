import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import DashboardEmpresa from './pages/DashboardEmpresa';
import DashboardUsuario from './pages/DashboardUsuario';
import Desafios from './pages/Desafios';
import FAQ from './pages/FAQ';
import Integrantes from './pages/Integrantes';
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/login/empresa',
        element: <Login isEmpresa={true} />,
      },
      {
        path: '/login/usuario',
        element: <Login isEmpresa={false} />,
      },
      {
        path: '/cadastro',
        element: <Cadastro />,
      },
      {
        path: '/empresa/dashboardEmpresa',
        element: (
          <ProtectedRoute requireEmpresa>
            <DashboardEmpresa />
          </ProtectedRoute>
        ),
      },
      {
        path: '/usuario/dashboardUsuario',
        element: (
          <ProtectedRoute requireUsuario>
            <DashboardUsuario />
          </ProtectedRoute>
        ),
      },
      {
        path: '/desafios',
        element: (
          <ProtectedRoute>
            <Desafios />
          </ProtectedRoute>
        ),
      },
      {
        path: '/faq',
        element: <FAQ />,
      },
      {
        path: '/integrantes',
        element: <Integrantes />,
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}

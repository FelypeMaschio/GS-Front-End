import { Navigate } from 'react-router-dom';
import { storageUtils } from '../services/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmpresa?: boolean;
  requireUsuario?: boolean;
}

export default function ProtectedRoute({
  children,
  requireEmpresa = false,
  requireUsuario = false,
}: ProtectedRouteProps) {
  
  const empresaId = storageUtils.getEmpresaId();
  const usuarioId = storageUtils.getUsuarioId();

  // Debug: log para verificar IDs
  console.log('🔒 ProtectedRoute - Verificando autenticação:', {
    requireEmpresa,
    requireUsuario,
    empresaId,
    usuarioId,
  });

  // Verificar autenticação específica
  if (requireEmpresa && !empresaId) {
    console.log('❌ Acesso negado: Requer ID de empresa, redirecionando para /login/empresa');
    return <Navigate to="/login/empresa" replace />;
  }

  if (requireUsuario && !usuarioId) {
    console.log('❌ Acesso negado: Requer ID de usuário, redirecionando para /login/usuario');
    return <Navigate to="/login/usuario" replace />;
  }

  // Se não especificou tipo, aceita qualquer um dos dois
  if (!requireEmpresa && !requireUsuario && !empresaId && !usuarioId) {
    console.log('❌ Acesso negado: Nenhum ID encontrado, redirecionando para /login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ Acesso permitido!');
  return <>{children}</>;
}
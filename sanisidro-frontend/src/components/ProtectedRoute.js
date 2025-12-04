import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // No está autenticado, redirigir al login
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user?.esAdmin) {
    // No es administrador, redirigir al inicio
    alert('⚠️ Acceso denegado. Solo administradores pueden acceder a esta sección.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

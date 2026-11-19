import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

// Hides pages from people who are not allowed to see them.
// NOTE: this is only convenience. The backend must enforce permissions too.
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

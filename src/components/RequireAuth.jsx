import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../store/useStore';

/** The whole site sits behind a login; unauthenticated visitors go to /login. */
export default function RequireAuth({ children }) {
  const token = useAuth((s) => s.token);
  const { pathname, search } = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ next: pathname + search }} />;
  return children;
}

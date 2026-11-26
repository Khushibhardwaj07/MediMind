// A guard for pages. Not logged in -> login page.
// Wrong role -> "forbidden" page. Otherwise show the page.
// Remember: this only hides pages. The backend is the real lock.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="center-text">Loading...</p>;

  if (!user) {
    // Remember where they wanted to go, so we can send them back after login.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
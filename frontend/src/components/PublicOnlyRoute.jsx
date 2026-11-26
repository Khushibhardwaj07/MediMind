// For the login and signup pages: if you are already logged in, go to the app instead.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function PublicOnlyRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="center-text">Loading...</p>;

  if (user) {
    return <Navigate to={(location.state && location.state.from) || '/'} replace />;
  }

  return <Outlet />;
}
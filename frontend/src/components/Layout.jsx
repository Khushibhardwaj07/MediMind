// The frame around every logged-in page: top bar, menu, content, disclaimer.
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Each role sees different menu items.
const MENU_BY_ROLE = {
  patient: [{ to: '/access', label: 'My doctors' }],
  doctor: [{ to: '/patients', label: 'My patients' }],
  admin: [{ to: '/admin/users', label: 'Users' }],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const links = [{ to: '/', label: 'Home' }, ...(MENU_BY_ROLE[user.role] || [])];

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">MediMind</span>
        <button type="button" className="btn btn-small btn-outline-light" onClick={logout}>
          Log out
        </button>
      </header>

      <nav className="nav" aria-label="Main menu">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="content">
        <Outlet />
      </main>

      <footer className="disclaimer">
        MediMind explains medical information in simple words. It does not diagnose and is not
        medical advice. Please always talk to your doctor.
      </footer>
    </div>
  );
}
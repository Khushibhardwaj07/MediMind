// The map of the app: which web address shows which page, and who may enter.
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicOnlyRoute from './components/PublicOnlyRoute.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DoctorPatients from './pages/DoctorPatients.jsx';
import Forbidden from './pages/Forbidden.jsx';
import Login from './pages/Login.jsx';
import MyDoctors from './pages/MyDoctors.jsx';
import NotFound from './pages/NotFound.jsx';
import Signup from './pages/Signup.jsx';

export default function App() {
  return (
    <Routes>
      {/* Only for people who are NOT logged in */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Only for logged-in people */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/forbidden" element={<Forbidden />} />

          {/* Role-specific pages */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/access" element={<MyDoctors />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
            <Route path="/patients" element={<DoctorPatients />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
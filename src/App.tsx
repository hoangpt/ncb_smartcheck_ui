import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentManager from './pages/DocumentManager';
import Reconciliation from './pages/Reconciliation';
import Workbench from './pages/Workbench';
import Exceptions from './pages/Exceptions';
import Config from './pages/Config';
import UserManagement from './pages/UserManagement';
import MainLayout from './layout/MainLayout';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const role = localStorage.getItem('role');
  const isAdmin = role === 'Admin';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes nested under MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentManager />} />
            <Route path="/reconciliation" element={<Reconciliation />} />
            <Route path="/reconciliation/:id" element={<Workbench />} />
            <Route path="/exceptions" element={<Exceptions />} />
            <Route path="/config" element={<Config />} />
            {/* Admin only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/users" element={<UserManagement />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

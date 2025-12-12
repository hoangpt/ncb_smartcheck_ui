import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentManager from './pages/smartcheck/DocumentManager';
import Reconciliation from './pages/smartcheck/Reconciliation';
import Workbench from './pages/smartcheck/Workbench';
import Exceptions from './pages/smartcheck/Exceptions';
import Config from './pages/config/Config';
import MainLayout from './layout/MainLayout';

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
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
            <Route path="/documents" element={<DocumentManager />} />
            <Route path="/reconciliation" element={<Reconciliation />} />
            <Route path="/reconciliation/:id" element={<Workbench />} />
            <Route path="/exceptions" element={<Exceptions />} />
            <Route path="/config" element={<Config />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

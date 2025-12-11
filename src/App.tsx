import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DocumentManager from './pages/DocumentManager';
import Reconciliation from './pages/Reconciliation';
import Workbench from './pages/Workbench';
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
            <Route path="/exceptions" element={<div className="p-8">Exceptions Page (Implementing...)</div>} />
            <Route path="/config" element={<div className="p-8">Config Page (Implementing...)</div>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

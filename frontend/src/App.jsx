import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Layout from './components/Layout';
import DashboardContent from './pages/DashboardContent';
import ProposalFormContent from './pages/ProposalFormContent';
import DevTools from './components/DevTools';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Brief check while Firebase determines auth state
  if (loading) {
    return null; // Or a minimal spinner if needed
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  // Brief check while Firebase determines auth state
  if (loading) {
    return null;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardContent />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/proposal/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ProposalFormContent />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <DevTools />
      </AuthProvider>
    </BrowserRouter>
  );
}

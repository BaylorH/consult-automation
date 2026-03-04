import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import DashboardContent from './pages/DashboardContent';
import ProposalFormContent from './pages/ProposalFormContent';
import DevTools from './components/DevTools';

// Minimum time to show loading screen (ms)
const MIN_LOADING_TIME = 1200;

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading: authLoading } = useAuth();
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [hasStartedLoading, setHasStartedLoading] = useState(false);

  // Start minimum loading timer on mount
  useEffect(() => {
    if (!hasStartedLoading) {
      setHasStartedLoading(true);
      const timer = setTimeout(() => {
        setMinTimeElapsed(true);
      }, MIN_LOADING_TIME);
      return () => clearTimeout(timer);
    }
  }, [hasStartedLoading]);

  // Show loading screen until BOTH auth is done AND minimum time has passed
  const showLoading = authLoading || !minTimeElapsed;

  if (showLoading) {
    return <LoadingScreen />;
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

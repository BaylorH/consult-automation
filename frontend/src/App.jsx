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
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Start minimum loading timer when we have a user
  useEffect(() => {
    if (user && !minTimeElapsed) {
      const timer = setTimeout(() => {
        setMinTimeElapsed(true);
      }, MIN_LOADING_TIME);
      return () => clearTimeout(timer);
    }
  }, [user, minTimeElapsed]);

  // Show loading while auth is checking
  if (loading) {
    return <LoadingScreen />;
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but minimum time hasn't elapsed - show loading
  if (!minTimeElapsed) {
    return <LoadingScreen />;
  }

  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  // Show loading screen while checking auth state
  if (loading) {
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

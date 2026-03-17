import { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Layout from './components/Layout';
import DashboardContent from './pages/DashboardContent';
import ProposalFormContent from './pages/ProposalFormContent';
import PresentationPage from './pages/PresentationPage';
import DevTools from './components/DevTools';
import SplashCursor from './components/SplashCursor';

// Context for the Easter egg SplashCursor toggle
const SplashCursorContext = createContext(null);

export function useSplashCursor() {
  return useContext(SplashCursorContext);
}

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
      <Route
        path="/proposal/:id/presentation"
        element={
          <ProtectedRoute>
            <PresentationPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  // Easter egg: SplashCursor defaults to OFF
  const [splashCursorEnabled, setSplashCursorEnabled] = useState(false);

  const toggleSplashCursor = () => {
    setSplashCursorEnabled(prev => !prev);
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <SplashCursorContext.Provider value={{ splashCursorEnabled, toggleSplashCursor }}>
          {splashCursorEnabled && <SplashCursor />}
          <AppRoutes />
          <DevTools />
        </SplashCursorContext.Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ModelProvider } from './context/ModelContext.jsx';
import { ToastContainer } from './components/common/ToastContainer.jsx';
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';

// Application Pages
import { Dashboard } from './pages/Dashboard.jsx';
import { ModelsCatalog } from './pages/ModelsCatalog.jsx';
import { Favorites } from './pages/Favorites.jsx';
import { RecentModels } from './pages/RecentModels.jsx';
import { Profile } from './pages/Profile.jsx';
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { ForgotPassword } from './pages/ForgotPassword.jsx';

export default function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <ModelProvider>
            <ToastContainer />
            <BrowserRouter>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Application Routes */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="models" element={<ModelsCatalog />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="recent" element={<RecentModels />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* Root Redirection */}
                <Route path="/" element={<Navigate to="/app" replace />} />
                <Route path="*" element={<Navigate to="/app" replace />} />
              </Routes>
            </BrowserRouter>
          </ModelProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}

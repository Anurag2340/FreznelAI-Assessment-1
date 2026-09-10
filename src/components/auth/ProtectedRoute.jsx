import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LoadingSkeleton } from '../common/LoadingSkeleton.jsx';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-[#141414]">
        <div className="max-w-md w-full p-6 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1473e6] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Initializing ModelHub security session...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

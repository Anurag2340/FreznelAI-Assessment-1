import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../firebase/authService.js';
import { BiometricAuthService } from '../classes/BiometricAuthService.js';
import { isFirebaseConfigured } from '../firebase/config.js';
import { useToast } from './ToastContext.jsx';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    // Listen to Firebase or session authentication listener
    const unsubscribe = AuthService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsBiometricEnrolled(BiometricAuthService.isEnrolled(currentUser.uid));
      }
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    setAuthError(null);
    try {
      const loggedUser = await AuthService.signIn(email, password);
      setUser(loggedUser);
      setIsBiometricEnrolled(BiometricAuthService.isEnrolled(loggedUser.uid));
      addToast(`Welcome back, ${loggedUser.displayName || 'Developer'}!`, 'success');
      return loggedUser;
    } catch (err) {
      const friendlyMsg = AuthService.formatErrorMessage(err);
      setAuthError(friendlyMsg);
      addToast(friendlyMsg, 'error');
      throw new Error(friendlyMsg);
    }
  };

  const signUp = async (arg1, arg2, arg3) => {
    setAuthError(null);
    let fullName = '';
    let email = '';
    let password = '';

    if (typeof arg1 === 'object' && arg1 !== null) {
      fullName = arg1.fullName || arg1.displayName || '';
      email = arg1.email || '';
      password = arg1.password || '';
    } else if (typeof arg1 === 'string' && arg1.includes('@')) {
      email = arg1;
      password = arg2;
      fullName = arg3 || email.split('@')[0];
    } else {
      fullName = arg1;
      email = arg2;
      password = arg3;
    }

    try {
      const newUser = await AuthService.signUp(fullName, email, password);
      setUser(newUser);
      addToast('Account created successfully.', 'success');
      return newUser;
    } catch (err) {
      const friendlyMsg = AuthService.formatErrorMessage(err);
      setAuthError(friendlyMsg);
      addToast(friendlyMsg, 'error');
      throw new Error(friendlyMsg);
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      localStorage.removeItem('modelhub_auth_user');
      addToast('Signed out successfully.', 'info');
    } catch (err) {
      setUser(null);
      localStorage.removeItem('modelhub_auth_user');
      addToast('Signed out.', 'info');
    }
  };

  const resetPassword = async (email) => {
    try {
      await AuthService.resetPassword(email);
      addToast('Password reset email sent. Check your inbox.', 'success');
      return true;
    } catch (err) {
      const friendlyMsg = AuthService.formatErrorMessage(err);
      addToast(friendlyMsg, 'error');
      throw new Error(friendlyMsg);
    }
  };

  const updateProfileName = async (name) => {
    try {
      await AuthService.updateProfileName(name);
      setUser((prev) => prev ? { ...prev, displayName: name } : prev);
      addToast('Profile name updated.', 'success');
    } catch (err) {
      addToast('Failed to update display name.', 'error');
    }
  };

  const biometricLogin = async (email) => {
    try {
      const res = await BiometricAuthService.authenticate(email);
      if (res.success) {
        const currentUser = user || {
          uid: 'bio-verified-user',
          email: email || 'engineer@modelhub.ai',
          displayName: 'Authenticated User (Biometrics)',
          createdAt: new Date().toISOString()
        };
        setUser(currentUser);
        addToast(`Verified via ${res.method}!`, 'success');
        return currentUser;
      }
    } catch (err) {
      addToast('Biometric verification failed.', 'error');
      throw err;
    }
  };

  const enrollBiometrics = async () => {
    if (!user) return;
    try {
      await BiometricAuthService.enrollBiometrics(user);
      setIsBiometricEnrolled(true);
      addToast('Biometric device / Passkey enrolled successfully!', 'success');
    } catch (err) {
      addToast('Could not complete biometric enrollment.', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isConfigured: isFirebaseConfigured,
        isBiometricEnrolled,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfileName,
        biometricLogin,
        enrollBiometrics,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

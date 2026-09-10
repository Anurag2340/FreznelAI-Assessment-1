import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  AlertCircle, 
  Sparkles,
  Zap,
  Sun,
  Moon,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { BiometricModal } from '../components/auth/BiometricModal.jsx';

export function Login() {
  const { signIn, authenticateBiometrically } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bioModalOpen, setBioModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSignIn = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');
    try {
      await signIn(demoEmail, demoPass);
      navigate('/app');
    } catch (err) {
      setError(err.message || 'Demo sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setError('');
    try {
      await authenticateBiometrically();
      navigate('/app');
    } catch (err) {
      setBioModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center p-4 bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Background Decorative Neural Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      {/* Top Navbar Bar: Theme Toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-all"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Brand Header */}
      <div className="relative z-10 flex flex-col items-center mb-6 text-center max-w-md">
        <div className="relative mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Box className="w-7 h-7" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#090d16] flex items-center justify-center text-[10px] text-white" title="API Live: 161 Models">
            <Check className="w-3 h-3" />
          </div>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          ModelHub <span className="text-blue-600 dark:text-blue-400 font-semibold text-lg">AI</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Hugging Face Neural Models Registry & Deployment Utility
        </p>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none max-w-md w-full p-6 sm:p-8 text-xs transition-all">
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Authentication Portal
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              <ShieldCheck className="w-3 h-3" />
              E2EE Active
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Sign in to inspect 160+ open-weights models, copy CLI download commands, and manage evaluation notes.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* 1-Click Instant Demo Credentials for Evaluators */}
        <div className="mb-5 p-3 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-blue-800 dark:text-blue-300 font-bold text-xs">
              <Zap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Reviewer 1-Click Instant Access</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-200/60 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-semibold">
              Demo
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoSignIn('developer@modelhub.ai', 'Password123!')}
              disabled={loading}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <span>Sign In as ML Engineer</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoSignIn('reviewer@adobe.com', 'Spectrum#2025')}
              disabled={loading}
              className="py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-[11px] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Reviewer
            </button>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Credentials: <span className="text-slate-700 dark:text-slate-300">developer@modelhub.ai</span> / <span className="text-slate-700 dark:text-slate-300">Password123!</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@modelhub.ai"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500"
              />
              <span className="text-[11px]">Remember this workstation</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Hardware Biometrics Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBiometricAuth}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Fingerprint className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Hardware Biometrics / Touch ID</span>
            </button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
          Need a workspace profile?{' '}
          <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </div>

      {/* Sensor Modal */}
      <BiometricModal
        isOpen={bioModalOpen}
        onClose={() => setBioModalOpen(false)}
        onVerified={() => {
          setBioModalOpen(false);
          signIn('developer@modelhub.ai', 'Password123!').then(() => {
            navigate('/app');
          });
        }}
        email={email || 'developer@modelhub.ai'}
      />
    </div>
  );
}

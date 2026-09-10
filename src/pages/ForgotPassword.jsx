import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { Box, Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { SpectrumButton } from '../components/common/SpectrumButton.jsx';

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-[#f8f9fa] dark:bg-[#121212] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-150">
      <div className="flex flex-col items-center mb-6 text-center">
        <div className="w-12 h-12 rounded-lg bg-[#1473e6] flex items-center justify-center text-white shadow-md mb-3">
          <Box className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Recover access to your ModelHub workspace
        </p>
      </div>

      <div className="bg-white dark:bg-[#1b1b1b] border border-neutral-200 dark:border-[#2d2d2d] rounded-lg shadow-xl max-w-sm w-full p-6 text-xs animate-in fade-in zoom-in-95 duration-150">
        {submitted ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Reset Link Sent
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              If an account exists for <strong className="text-neutral-800 dark:text-neutral-200">{email}</strong>, you will receive password reset instructions.
            </p>
            <div className="pt-3">
              <Link to="/login">
                <SpectrumButton variant="primary" size="medium" className="w-full justify-center">
                  Return to Sign In
                </SpectrumButton>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Enter your verified email address and we'll send you instructions to reset your password.
            </p>

            {error && (
              <div className="flex items-start gap-2 p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#222] border border-neutral-300 dark:border-[#383838] rounded text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#1473e6]"
                />
              </div>
            </div>

            <SpectrumButton
              variant="primary"
              size="large"
              type="submit"
              loading={loading}
              className="w-full justify-center text-xs font-semibold"
            >
              Send Reset Instructions
            </SpectrumButton>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-[#1473e6] hover:underline font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

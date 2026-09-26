import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Printer, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/ErrorState';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email.trim(), password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email or password';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDefaultCredentials = () => {
    setEmail('admin@printshop.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden selection:bg-violet-500 selection:text-white">
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center p-3.5 rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-pink-500 shadow-xl shadow-violet-500/20 ring-4 ring-violet-500/10">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
              <Printer className="w-7 h-7 text-violet-600" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center justify-center gap-2">
              PrintCraft
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
              Printing & Gift Shop Management Portal
            </p>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/80 border border-slate-200">
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Admin Sign In</h2>
              <p className="text-xs text-slate-500">Access your shop control panel</p>
            </div>
            <div className="p-2.5 rounded-2xl bg-violet-50 text-violet-600 border border-violet-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <ErrorState title="Authentication Failed" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@printshop.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full mt-2"
              icon={ArrowRight}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Default Admin Credentials
            </p>
            <button
              onClick={fillDefaultCredentials}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono text-violet-700 font-bold transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>admin@printshop.com</span>
              <span className="text-slate-300">•</span>
              <span>admin123</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400 font-medium mt-6">
          &copy; {new Date().getFullYear()} PrintCraft Billing & Job Management System
        </p>
      </div>
    </div>
  );
};

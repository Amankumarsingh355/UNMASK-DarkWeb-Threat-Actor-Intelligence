// ============================================================
// UNMASK // PRODUCTION CREATE ACCOUNT VIEW
// Multi-field Account Creation with Argon2id & Unique User ID
// ============================================================

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MatrixBinaryBackground } from '../components/CitizenPortal/MatrixBinaryBackground';

interface CreateAccountViewProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
  onNavigateHome: () => void;
  theme?: 'dark' | 'light';
}

export const CreateAccountView: React.FC<CreateAccountViewProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  onNavigateHome,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setLoadingStep('Generating secure internal UNMASK User ID & hashing password with Argon2id...');

    try {
      const result = await register(email, password, fullName, userId || undefined);
      if (result.success) {
        setIsSuccess(true);
        setLoadingStep('Account successfully created! Logging you into UNMASK...');
        setTimeout(() => {
          setIsLoading(false);
          onRegisterSuccess();
        }, 600);
      } else {
        setIsLoading(false);
        setErrorMessage(result.error || 'Failed to create account.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Registration failed.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans selection:bg-cyan-500/30 selection:text-cyan-200 transition-colors relative overflow-x-hidden ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#020408] text-white'
    }`}>
      {/* Matrix Cascading Binary Digital Rain Background Canvas */}
      <MatrixBinaryBackground isLight={isLight} opacity={0.85} />

      {/* Top Header / Back Navigation */}
      <header className={`h-16 px-6 flex items-center justify-between border-b backdrop-blur-xl relative z-20 ${
        isLight ? 'bg-white/95 border-slate-200 shadow-xs' : 'bg-[#02050c]/90 border-cyan-500/25 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
      }`}>
        <button
          onClick={onNavigateHome}
          className={`flex items-center space-x-2 text-xs font-mono font-bold transition-colors cursor-pointer ${
            isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-cyan-300'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to UNMASK Public Portal</span>
        </button>

        <div className="flex items-center space-x-2 font-mono">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]"></span>
          <span className={`text-[11px] font-bold ${isLight ? 'text-slate-600' : 'text-cyan-300'}`}>
            NEW-USER-REGISTRATION-NODE
          </span>
        </div>
      </header>

      {/* Main Centered Registration Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4 relative z-10">
        <div className="w-full max-w-lg space-y-5">
          {/* Brand Logo & Header */}
          <div className="text-center space-y-2">
            <button
              onClick={onNavigateHome}
              className="inline-block mx-auto group cursor-pointer focus:outline-none"
              title="UNMASK - Return to Home"
            >
              <div className={`w-14 h-14 rounded-2xl p-1 flex items-center justify-center mx-auto transition-transform group-hover:scale-105 ${
                isLight
                  ? 'bg-white border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                  : 'bg-gradient-to-br from-[#0a1829] to-[#040a14] border border-cyan-400/60 shadow-[0_0_22px_rgba(6,182,212,0.5)]'
              }`}>
                <img 
                  src="/unmask-logo.png" 
                  alt="UNMASK Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
            </button>

            <div>
              <div className="flex items-center justify-center space-x-2">
                <span className={`font-display-tactical text-2xl font-black tracking-widest ${
                  isLight ? 'text-slate-900' : 'text-white matrix-glow-text'
                }`}>
                  CREATE UNMASK ACCOUNT
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider font-mono ${
                  isLight
                    ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/40'
                    : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                }`}>
                  NEW USER
                </span>
              </div>
              <p className={`text-xs mt-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Register an internal identity for Cyber Threat Intelligence & Reporting
              </p>
            </div>
          </div>

          {/* Registration Form Card */}
          <div className={`p-6 sm:p-8 rounded-2xl border shadow-2xl relative overflow-hidden ${
            isLight ? 'bg-white border-slate-200' : 'matrix-glass-card'
          }`}>
            {/* Top Glowing Border Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500"></div>

            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs font-semibold flex items-center space-x-2.5 animate-in shake duration-300 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success State Banner */}
            {isSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center space-x-2.5 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Account created successfully! Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleCreateAccount} className="space-y-3.5 font-sans">
              {/* Full Name */}
              <div className="space-y-1">
                <label className={`block text-[11px] font-bold tracking-wide uppercase font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    autoFocus
                    required
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs transition-all outline-hidden ${
                      isLight 
                        ? 'bg-slate-50 focus:bg-white border-slate-300 focus:border-cyan-500 text-slate-900' 
                        : 'matrix-input'
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className={`block text-[11px] font-bold tracking-wide uppercase font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investigator@example.com"
                    disabled={isLoading}
                    required
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-mono transition-all outline-hidden ${
                      isLight 
                        ? 'bg-slate-50 focus:bg-white border-slate-300 focus:border-cyan-500 text-slate-900' 
                        : 'matrix-input'
                    }`}
                  />
                </div>
              </div>

              {/* User ID (Optional or auto-generated) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className={`block text-[11px] font-bold tracking-wide uppercase font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    User ID <span className="text-[10px] text-slate-500 font-normal font-mono">(Optional - auto-generated if blank)</span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Key className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. UNMASK-USER-000001"
                    disabled={isLoading}
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-mono transition-all outline-hidden ${
                      isLight 
                        ? 'bg-slate-50 focus:bg-white border-slate-300 focus:border-cyan-500 text-slate-900' 
                        : 'matrix-input'
                    }`}
                  />
                </div>
              </div>

              {/* Password & Confirm Password side by side on desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold tracking-wide uppercase font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 chars"
                      disabled={isLoading}
                      required
                      className={`w-full pl-8 pr-8 py-2.5 rounded-xl border text-xs font-mono transition-all outline-hidden ${
                        isLight 
                          ? 'bg-slate-50 focus:bg-white border-slate-300 focus:border-cyan-500 text-slate-900' 
                          : 'matrix-input'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className={`block text-[11px] font-bold tracking-wide uppercase font-mono ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      disabled={isLoading}
                      required
                      className={`w-full pl-8 pr-8 py-2.5 rounded-xl border text-xs font-mono transition-all outline-hidden ${
                        isLight 
                          ? 'bg-slate-50 focus:bg-white border-slate-300 focus:border-cyan-500 text-slate-900' 
                          : 'matrix-input'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50 mt-3 font-mono ${
                  isLight
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md'
                    : 'matrix-button-primary'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="truncate">{loadingStep || 'Creating account...'}</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>CREATE ACCOUNT</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login link */}
            <div className={`mt-5 pt-4 border-t text-center space-y-2 ${isLight ? 'border-slate-200' : 'border-cyan-500/20'}`}>
              <div className="flex items-center justify-center space-x-1.5 text-xs font-mono">
                <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                  Already have an account?
                </span>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
                >
                  Log In Here
                </button>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center text-[10px] text-slate-500 space-y-0.5 font-mono">
            <p>NTRO DEFENSIVE CYBER OPERATIONS // IDENTITY REGISTRY</p>
            <p>Passwords are never stored in plaintext. Cryptographically hashed with Argon2id.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`h-11 px-6 flex items-center justify-between text-[11px] font-mono border-t relative z-20 ${
        isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-[#02050c]/90 border-cyan-500/20 text-slate-500'
      }`}>
        <span>UNMASK Security Layer v4.5</span>
        <span>Identity Protocol Active</span>
      </footer>
    </div>
  );
};


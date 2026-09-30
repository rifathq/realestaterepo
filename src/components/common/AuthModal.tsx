import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff, Building2, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login, user, logout, notify } = useMarketplace();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('Alexander Wright');
  const [email, setEmail] = useState('a.wright@firm-partners.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      logout();
      setAuthModalOpen(false);
      return;
    }
    login(name || 'Alexander Wright', email || 'a.wright@firm-partners.com');
    notify(isRegister ? `Welcome to Digentic, ${name || 'Alexander'}!` : `Signed in as ${name || 'Alexander Wright'}`);
    setAuthModalOpen(false);
  };

  const handleGoogleSignIn = () => {
    login('Alexander Wright', 'a.wright@firm-partners.com');
    notify('Successfully authenticated with Google.');
    setAuthModalOpen(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setAuthModalOpen(false);
      }}
    >
      <div 
        className="w-full max-w-md bg-white border border-neutral-100 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative text-left animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Branding & Header */}
        <div className="flex flex-col items-center text-center pt-1 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-white flex items-center justify-center shadow-md mb-3.5 border border-neutral-800">
            <Building2 className="w-6 h-6 stroke-[1.8] text-amber-100" />
          </div>
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 font-architectural">
            {user ? 'Account Settings' : isRegister ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xs leading-normal">
            {user 
              ? 'Manage your portfolio and verified credentials' 
              : isRegister
              ? 'Join Digentic Realty for exclusive architectural listings & private advisory'
              : 'Sign in to access your saved homes, private tours & portfolio'}
          </p>
        </div>

        {user ? (
          /* Authenticated User View */
          <div className="py-4 space-y-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">Authenticated Member</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                  Verified Client
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-neutral-900">{user.name}</p>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">{user.email}</p>
              </div>
            </div>
            
            <button
              onClick={() => {
                logout();
                notify('Signed out successfully.');
                setAuthModalOpen(false);
              }}
              className="w-full py-3 px-4 text-xs sm:text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl border border-neutral-200 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        ) : (
          /* Sign In / Register Form */
          <div className="space-y-4">
            {/* Social Logins: Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-medium text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.36 7.33 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.64 1.26 6.58l4.02 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-neutral-200" />
              <span className="absolute bg-white px-3 text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
                or continue with email
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Full Name / Legal Entity
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.8]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alexander Wright"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.8]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[1.8]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Eye className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Utility Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-600 hover:text-neutral-900">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-black accent-black cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => notify('Password reset instructions sent to your email.')}
                    className="text-xs font-medium text-neutral-600 hover:text-neutral-950 underline underline-offset-2 cursor-pointer transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 mt-2 text-xs sm:text-sm font-medium tracking-wide text-white bg-black hover:bg-neutral-900 active:scale-95 rounded-xl border border-black shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>

              {/* Footer Toggle */}
              <div className="pt-2 text-center text-xs text-neutral-500">
                {isRegister ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegister(false)}
                      className="font-semibold text-neutral-950 hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegister(true)}
                      className="font-semibold text-neutral-950 hover:underline cursor-pointer"
                    >
                      Create an account
                    </button>
                  </span>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

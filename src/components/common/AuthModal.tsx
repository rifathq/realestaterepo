import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login, user, logout } = useMarketplace();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('Alexander Wright');
  const [email, setEmail] = useState('a.wright@firm-partners.com');
  const [password, setPassword] = useState('••••••••••••');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      logout();
      setAuthModalOpen(false);
      return;
    }
    login(name || 'Alexander Wright', email || 'a.wright@firm-partners.com');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white border border-stone-200 shadow-xl overflow-hidden p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 id="auth-modal-title" className="text-xl font-semibold tracking-tight text-stone-900">
              {user ? 'Account Settings' : isRegister ? 'Create ESTRA Account' : 'Sign In to ESTRA'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {user 
                ? 'Manage your portfolio and verified credentials' 
                : 'Access saved properties, tours, and direct acquisitions'}
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {user ? (
          <div className="py-6 space-y-4">
            <div className="p-4 bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">Authenticated User</span>
                <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  Verified Client
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-900">{user.name}</p>
              <p className="text-xs text-stone-600">{user.email}</p>
            </div>
            
            <button
              onClick={() => {
                logout();
                setAuthModalOpen(false);
              }}
              className="w-full py-2.5 px-4 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-6 space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1.5">
                  Full Name / Legal Entity
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3 stroke-[1.5]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Wright"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-900 transition-colors bg-stone-50/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                Corporate or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3 stroke-[1.5]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-900 transition-colors bg-stone-50/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-stone-700">Password</label>
                {!isRegister && (
                  <button type="button" className="text-xs text-stone-500 hover:text-stone-900">
                    Reset key?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3 stroke-[1.5]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-900 transition-colors bg-stone-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 mt-2 text-xs font-medium tracking-tight text-white bg-stone-900 hover:bg-stone-800 transition-colors"
            >
              {isRegister ? 'Complete Verification & Register' : 'Authenticate Session'}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-stone-500 hover:text-stone-900 transition-colors"
              >
                {isRegister
                  ? 'Already verified with ESTRA? Sign in'
                  : 'New investor or tenant? Create an account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

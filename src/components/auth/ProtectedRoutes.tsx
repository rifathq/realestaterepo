import React from 'react';
import { Navigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

export const AdminProtectedRoute: React.FC = () => {
  const { user, loading, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
        <p className="text-xs uppercase tracking-widest font-mono text-slate-400">
          Verifying Institutional Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-architectural text-white mb-2">
            Restricted Administration
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Your current account role (<span className="text-amber-400 font-mono font-medium">{user.role}</span>) does not have Super Admin management privileges.
          </p>
          {user.role === 'agent' ? (
            <Link
              to="/agent/dashboard"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all"
            >
              <span>Switch to Agent Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-black hover:bg-neutral-900 text-white font-medium text-xs rounded-xl border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
            >
              <span>Return to Public Portal</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export const AgentProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
        <p className="text-xs uppercase tracking-widest font-mono text-slate-400">
          Verifying Agent Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/agent/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'agent' && user.role !== 'super_admin') {
    return <Navigate to="/agent/login" replace />;
  }

  return <Outlet />;
};

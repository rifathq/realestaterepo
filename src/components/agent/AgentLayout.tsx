import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Inbox,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  BadgeCheck,
} from 'lucide-react';

const agentNavItems = [
  { label: 'Overview', href: '/agent/dashboard', icon: LayoutDashboard },
  { label: 'My Listings', href: '/agent/properties', icon: Building2 },
  { label: 'Client Leads', href: '/agent/leads', icon: Inbox, badge: 'Active' },
  { label: 'Tour Calendar', href: '/agent/appointments', icon: CalendarCheck },
  { label: 'Advisor Profile', href: '/agent/profile', icon: User },
];

export const AgentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/agent/login');
  };

  const currentItem = agentNavItems.find(
    (item) => location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex font-sans antialiased selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern SaaS Agent Workspace Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-architectural font-bold text-white text-base tracking-tight leading-none">
                DIGENTIC
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-semibold mt-1">
                Advisor Portal
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Agent Profile Tile */}
        <div className="p-4 mx-4 mt-4 mb-2 bg-neutral-950/60 border border-neutral-800/80 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-amber-400">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.slice(0, 2).toUpperCase() || 'AG'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <BadgeCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                Licensed Advisor
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 text-xs">
          <div className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Advisor Management
          </div>
          {agentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/agent/dashboard' && location.pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium transition-all group ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-neutral-400 group-hover:text-neutral-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/60 rounded-lg transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Bar */}
        <header className="h-16 px-4 sm:px-8 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
              <span className="text-neutral-500">Agent Portal</span>
              <span className="text-neutral-700">/</span>
              <span className="text-white font-semibold">
                {currentItem?.label || 'Console'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] font-mono text-amber-400">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>CA-DRE #02198421</span>
            </div>

            <div className="relative">
              <button
                type="button"
                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 relative cursor-pointer"
                title="Client Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              </button>
            </div>

            <div className="h-4 w-px bg-neutral-800" />

            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white leading-none">{user?.name}</div>
              <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Assigned Agent</div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 bg-neutral-950 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

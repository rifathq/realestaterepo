import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  CalendarCheck,
  Inbox,
  Star,
  Tags,
  MapPin,
  FileText,
  Image as ImageIcon,
  Settings,
  ShieldCheck,
  Activity,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
  Search,
  ChevronRight,
  Scale,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Activity Logs', href: '/admin/activity', icon: Activity },
      { label: 'Compliance', href: '/admin/compliance', icon: Scale },
    ],
  },
  {
    title: 'Asset Portfolio',
    items: [
      { label: 'Properties', href: '/admin/properties', icon: Building2 },
      { label: 'Asset Categories', href: '/admin/categories', icon: Tags },
      { label: 'Metropolitan Hubs', href: '/admin/locations', icon: MapPin },
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    ],
  },
  {
    title: 'Advisory & CRM',
    items: [
      { label: 'Agents', href: '/admin/agents', icon: Briefcase },
      { label: 'Private Tours', href: '/admin/appointments', icon: CalendarCheck, badge: 'Live' },
      { label: 'Inquiries & Leads', href: '/admin/leads', icon: Inbox, badge: 'New' },
      { label: 'Client Reviews', href: '/admin/reviews', icon: Star },
    ],
  },
  {
    title: 'Platform Administration',
    items: [
      { label: 'Platform Users', href: '/admin/users', icon: Users },
      { label: 'Admin Users & RBAC', href: '/admin/admin-users', icon: ShieldCheck },
      { label: 'Content Management', href: '/admin/content', icon: FileText },
      { label: 'System Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // Find active item for breadcrumb
  const currentItem = navSections
    .flatMap((s) => s.items)
    .find((item) => location.pathname === item.href || location.pathname.startsWith(`${item.href}/`));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern SaaS Dark Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-architectural font-bold text-white text-base tracking-tight leading-none">
                DIGENTIC
              </div>
              <div className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-semibold mt-1">
                Enterprise Admin
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card in Sidebar */}
        <div className="p-4 mx-4 mt-4 mb-2 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xs text-amber-400">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.slice(0, 2).toUpperCase() || 'AD'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Super Admin
              </span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-3 overflow-y-auto space-y-6 text-xs">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.href ||
                  (item.href !== '/admin/dashboard' && location.pathname.startsWith(`${item.href}/`));
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all group ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
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
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-medium text-white bg-black hover:bg-neutral-900 border border-black rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-white" />
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
        <header className="h-16 px-4 sm:px-8 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span className="text-slate-500">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-white font-semibold">
                {currentItem?.label || 'Console'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Search Bar */}
            <div className="hidden md:flex items-center relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Search console..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* System Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Audit Ledger Active</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 relative cursor-pointer"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              </button>
            </div>

            <div className="h-4 w-px bg-slate-800" />

            {/* Profile Avatar / Quick Link */}
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white leading-none">{user?.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{user?.email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 bg-slate-950 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

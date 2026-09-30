import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AuthModal } from './components/common/AuthModal';
import { AdminProtectedRoute, AgentProtectedRoute } from './components/auth/ProtectedRoutes';
import { AdminLayout } from './components/admin/AdminLayout';
import { AgentLayout } from './components/agent/AgentLayout';

// Public Pages
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { SavedPage } from './pages/SavedPage';
import { SellPage } from './pages/SellPage';
import { TourPage } from './pages/TourPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { JoinAgentPage } from './pages/JoinAgentPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';

// Admin Portal Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminAgentsPage } from './pages/admin/AdminAgentsPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminLeadsPage } from './pages/admin/AdminLeadsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminLocationsPage } from './pages/admin/AdminLocationsPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAdminUsersPage } from './pages/admin/AdminAdminUsersPage';
import { AdminActivityPage } from './pages/admin/AdminActivityPage';

// Agent Portal Pages
import { AgentLoginPage } from './pages/agent/AgentLoginPage';
import { AgentDashboardPage } from './pages/agent/AgentDashboardPage';
import { AgentPropertiesPage } from './pages/agent/AgentPropertiesPage';
import { AgentLeadsPage } from './pages/agent/AgentLeadsPage';
import { AgentAppointmentsPage } from './pages/agent/AgentAppointmentsPage';
import { AgentProfilePage } from './pages/agent/AgentProfilePage';

const NotificationToast = () => {
  const { notification } = useMarketplace();
  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-stone-900 text-white px-4 py-3 text-xs font-medium border border-stone-700 shadow-lg flex items-center gap-2 animate-fade-in">
      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
      <span>{notification}</span>
    </div>
  );
};

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-stone-900 selection:text-white antialiased">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <AuthModal />
      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* 1. PUBLIC WEBSITE ROUTES */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:slug" element={<PropertyDetailPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/tour/:property" element={<TourPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/agents/arlington" element={<AgentsPage defaultCity="Arlington, VA" />} />
              <Route path="/agents/chicago" element={<AgentsPage defaultCity="Chicago" />} />
              <Route path="/agents/:slug" element={<AgentDetailPage />} />
              <Route path="/join-agent" element={<JoinAgentPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* 2. ADMIN PORTAL (Separated & Protected) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="properties" element={<AdminPropertiesPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="agents" element={<AdminAgentsPage />} />
                <Route path="appointments" element={<AdminAppointmentsPage />} />
                <Route path="leads" element={<AdminLeadsPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="locations" element={<AdminLocationsPage />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="admin-users" element={<AdminAdminUsersPage />} />
                <Route path="activity" element={<AdminActivityPage />} />
              </Route>
            </Route>

            {/* 3. AGENT PORTAL (Separated & Protected) */}
            <Route path="/agent/login" element={<AgentLoginPage />} />
            <Route path="/agent" element={<AgentProtectedRoute />}>
              <Route element={<AgentLayout />}>
                <Route index element={<Navigate to="/agent/dashboard" replace />} />
                <Route path="dashboard" element={<AgentDashboardPage />} />
                <Route path="properties" element={<AgentPropertiesPage />} />
                <Route path="leads" element={<AgentLeadsPage />} />
                <Route path="appointments" element={<AgentAppointmentsPage />} />
                <Route path="profile" element={<AgentProfilePage />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </MarketplaceProvider>
    </AuthProvider>
  );
}

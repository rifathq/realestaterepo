import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AuthModal } from './components/common/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ComparePage } from './pages/ComparePage';
import { SavedPage } from './pages/SavedPage';
import { SellPage } from './pages/SellPage';
import { TourPage } from './pages/TourPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AgentsPage } from './pages/AgentsPage';
import { AgentDetailPage } from './pages/AgentDetailPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';

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

export default function App() {
  return (
    <MarketplaceProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-stone-900 selection:text-white antialiased">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:slug" element={<PropertyDetailPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/sell" element={<SellPage />} />
              <Route path="/tour/:property" element={<TourPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/agents/:slug" element={<AgentDetailPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
          <AuthModal />
          <NotificationToast />
        </div>
      </BrowserRouter>
    </MarketplaceProvider>
  );
}

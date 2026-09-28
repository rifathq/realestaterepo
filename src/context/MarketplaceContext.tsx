import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROPERTIES } from '../data/properties';
import { Property } from '../types/property';

interface MarketplaceContextType {
  savedIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  savedProperties: Property[];
  
  notification: string | null;
  notify: (message: string) => void;
  
  user: { name: string; email: string } | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const SAVED_STORAGE_KEY = 'estra_saved_properties_v1';
const USER_STORAGE_KEY = 'estra_user_session_v1';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved IDs
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? JSON.parse(stored) : ['prop-1', 'prop-2'];
    } catch {
      return ['prop-1', 'prop-2'];
    }
  });

  // User session
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const toggleSave = (id: string) => {
    const property = PROPERTIES.find(p => p.id === id);
    const title = property ? property.title : 'Property';
    if (savedIds.includes(id)) {
      setSavedIds(prev => prev.filter(item => item !== id));
      notify(`Removed "${title}" from saved properties`);
    } else {
      setSavedIds(prev => [...prev, id]);
      notify(`Saved "${title}" to your portfolio`);
    }
  };

  const isSaved = (id: string) => savedIds.includes(id);

  const savedProperties = PROPERTIES.filter(p => savedIds.includes(p.id));

  const login = (name: string, email: string) => {
    setUser({ name, email });
    setAuthModalOpen(false);
    notify(`Welcome back, ${name}`);
  };

  const logout = () => {
    setUser(null);
    notify('Signed out successfully');
  };

  return (
    <MarketplaceContext.Provider
      value={{
        savedIds,
        toggleSave,
        isSaved,
        savedProperties,
        notification,
        notify,
        user,
        login,
        logout,
        authModalOpen,
        setAuthModalOpen,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};

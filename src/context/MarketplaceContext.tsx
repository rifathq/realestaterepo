import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROPERTIES } from '../data/properties';
import { Property } from '../types/property';
import { api } from '../services/api';

interface MarketplaceContextType {
  savedIds: string[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  savedProperties: Property[];
  properties: Property[];
  reloadProperties: () => Promise<void>;
  content: any;
  reloadContent: () => Promise<void>;
  
  notification: string | null;
  notify: (message: string) => void;
  
  user: { name: string; email: string } | null;
  login: (name: string, email: string) => void;
  logout: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

const SAVED_STORAGE_KEY = 'digentic_saved_properties_v1';
const USER_STORAGE_KEY = 'digentic_user_session_v1';

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Properties state initialized with default properties, then synced with backend
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [content, setContent] = useState<any>({
    heroTitle: 'Real Estate for Business & Living',
    heroKicker: 'Q3/2026 Index',
    heroSubtitle: 'Rent, purchase, and manage verified commercial headquarters, modern residences, and urban development parcels with institutional precision.',
  });

  const reloadProperties = async () => {
    try {
      const data = await api.properties.list();
      if (Array.isArray(data)) {
        setProperties(data);
      }
    } catch {
      // Fallback to initial seed if backend is initializing
    }
  };

  const reloadContent = async () => {
    try {
      const data = await api.content.get();
      if (data && data.heroTitle) {
        setContent(data);
      }
    } catch {
      // Keep default
    }
  };

  useEffect(() => {
    reloadProperties();
    reloadContent();
  }, []);

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
    const property = properties.find(p => p.id === id) || PROPERTIES.find(p => p.id === id);
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

  const savedProperties = properties.filter(p => savedIds.includes(p.id));

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
        properties,
        reloadProperties,
        content,
        reloadContent,
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

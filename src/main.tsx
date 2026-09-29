// Guard against iframe/browser environment where window.fetch has only a getter
try {
  let _currentFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get() {
      return _currentFetch;
    },
    set(newFetch) {
      _currentFetch = newFetch;
    },
    configurable: true,
    enumerable: true,
  });
} catch (_) {
  // Ignore if already configured or unconfigurable
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Unregister any active service workers and clear browser caches immediately
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}
if (typeof window !== 'undefined' && 'caches' in window) {
  caches.keys().then((names) => {
    for (const name of names) caches.delete(name);
  });
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Force clear legacy local storage cache if schema was updated
try {
  const currentVersion = '5.1';
  const savedVersion = localStorage.getItem('navini_app_version');
  if (savedVersion !== currentVersion) {
    localStorage.removeItem('navini_checklist');
    localStorage.removeItem('navini_wardrobe');
    localStorage.removeItem('navini_timeline_v3');
    localStorage.removeItem('navini_timeline_v4');
    localStorage.setItem('navini_app_version', currentVersion);
  }
} catch (e) {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


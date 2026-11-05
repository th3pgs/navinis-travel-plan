import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pwa-updater'
import App from './App.tsx'

// Force clear legacy local storage cache if schema was updated
try {
  const currentVersion = '3.0';
  const savedVersion = localStorage.getItem('navini_app_version');
  if (savedVersion !== currentVersion) {
    localStorage.removeItem('navini_checklist');
    localStorage.removeItem('navini_wardrobe');
    localStorage.removeItem('navini_timeline_v3');
    localStorage.setItem('navini_app_version', currentVersion);
  }
} catch (e) {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


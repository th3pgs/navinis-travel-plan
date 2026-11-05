import { registerSW } from 'virtual:pwa-register';

// Auto update and refresh service worker immediately when new build is deployed
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
    // Automatically reload so the user instantly sees the newly deployed changes
    setTimeout(() => {
      window.location.reload();
    }, 500);
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

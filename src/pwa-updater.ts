import { registerSW } from 'virtual:pwa-register';

// Auto update and refresh service worker immediately when new build is deployed
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true);
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

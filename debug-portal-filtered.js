// Simple debug for portalFinalLayoutFiltered
// Paste this in browser console while the portal is running

const app = document.querySelector('#app').__vue_app__;
const store = app.config.globalProperties.$store;

console.log('portalFinalLayoutFiltered:', store.getters['portalData/portalFinalLayoutFiltered']);

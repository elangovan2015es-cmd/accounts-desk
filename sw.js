// Kaveri Accounts Desk – offline cache. Change VERSION after every upload so phones pick up the new app.
const VERSION='kad-v1';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  // network first (always newest app), fall back to cache when offline
  e.respondWith(fetch(e.request).then(r=>{ const copy=r.clone(); caches.open(VERSION).then(c=>c.put(e.request,copy)).catch(()=>{}); return r; }).catch(()=>caches.match(e.request)));
});

// TNCFL Hub service worker (Phase 1).
// Strategy: network-first with cache fallback. Online = always fresh data, cache
// updated silently. Offline = serves the last cached version.
//
// CACHE VERSION: bump this (v1 -> v2 ...) whenever site_data.json or TNCFL_hub.html
// changes significantly (new season, major update). The activate handler deletes the
// old cache on the next visit, forcing all clients to re-cache.
const CACHE = 'tncfl-hub-v1';

// Everything the hub needs to run fully offline.
// NOTE: header_logo.png IS included — since the logo de-embed it is network-loaded
// (no longer baked into the HTML), so it must be cached or it would break offline /
// flash on a cold load. salary_logo.png and h2h_logo.png likewise.
const ASSETS = [
  './TNCFL_hub.html',
  './site_data.json',
  './header_logo.png',
  './salary_logo.png',
  './h2h_logo.png',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install: pre-cache all assets.
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(cache){ return cache.addAll(ASSETS); })
  );
  self.skipWaiting();
});

// Activate: drop any old cache versions.
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first, fall back to cache. Successful responses refresh the cache.
self.addEventListener('fetch', function(e){
  e.respondWith(
    fetch(e.request)
      .then(function(response){
        var clone = response.clone();
        caches.open(CACHE).then(function(cache){ cache.put(e.request, clone); });
        return response;
      })
      .catch(function(){ return caches.match(e.request); })
  );
});

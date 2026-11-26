// Service worker de Control de Procesos.
// Hace la app instalable y que abra rápido. NO la vuelve funcional sin
// conexión: registrar una inspección siempre necesita alcanzar Firebase.

// Se sube la versión en cada cambio: al activarse, el service worker borra
// las copias guardadas con otro nombre y nadie se queda con la vieja
// (SPEC-012, SPEC-013). Debe coincidir con la versión de CHANGELOG.md.
const CACHE = 'calidad-v1.21.1';
const ESENCIALES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ESENCIALES)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Red primero. Al revés, una versión vieja se quedaría pegada en los
// dispositivos y las correcciones no llegarían a nadie.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});

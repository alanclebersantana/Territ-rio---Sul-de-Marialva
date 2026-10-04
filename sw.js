/* Service worker — Nosso Território 2.0
   Página: rede primeiro (atualizações aparecem sem limpar cache), com cache como reserva.
   Resto (mapa, geometria, ícones, scripts do Firebase): cache primeiro.
   Suba a versão em CACHE sempre que trocar mapa-base.webp, mapa-geo.json ou os ícones. */
const CACHE = 'nosso-territorio-v2.3.3';
const SHELL = ['./index.html', './manifest.json', './mapa-base.webp', './mapa-geo.json', './mapa-ruas.json', './casas.json', './icon-192.png', './icon-512.png', './icon-32.png'];
const EXT = [
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(SHELL);
    await Promise.all(EXT.map(u => c.add(new Request(u, { mode: 'no-cors' })).catch(() => {})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firestore/Auth: nunca interceptar (o SDK cuida do offline)
  if (/googleapis\.com|firebaseapp\.com|firebaseio\.com|identitytoolkit|securetoken/.test(url.host) && !/fonts\./.test(url.host)) return;
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (url.origin === location.origin || EXT.includes(req.url)) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return r; })));
});

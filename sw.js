const CACHE_NAME = 'ambienteon-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/servicos.html',
  '/ferramentas.html',
  '/contato.html',
  '/mapa.html',
  '/dashboard-cliente.html',
  '/agendamento.html',
  '/normas.html',
  '/calculadora.html',
  '/admin.html',
  '/dashboard.html',
  '/styles.css',
  '/admin.css',
  '/main.js',
  '/admin.js',
  '/manifest.webmanifest',
  '/logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

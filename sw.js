// AmbienteON Service Worker v8
// Estratégia: Network-First para HTML (com fallback para cache), Cache-First para assets estáticos.

const CACHE_NAME = 'ambienteon-v8';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/servicos.html',
  '/ferramentas.html',
  '/normas.html',
  '/contato.html',
  '/styles.css',
  '/main.js',
  '/logo.svg',
  '/manifest.webmanifest'
];

// Instalação: Cacheia os recursos essenciais
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cacheando recursos estáticos...');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Ignorar requisições para outras origens (ex: Google Fonts, APIs externas)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Ignorar requisições POST (como as da API de chat)
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // ESTRATÉGIA PARA NAVEGAÇÃO (Páginas HTML)
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Atualiza o cache com a versão mais recente da rede
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => {
          // Se falhar (offline), serve do cache
          return caches.match(event.request) || caches.match('/index.html');
        })
    );
    return;
  }

  // ESTRATÉGIA PARA ASSETS (CSS, JS, Imagens)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Opcional: cachear novos assets encontrados
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => {
            // Falha total (offline e sem cache)
            return new Response('Recurso não disponível offline', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

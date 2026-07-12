/* 教車App Service Worker — 網絡優先：有網永遠攞最新版，冇網先用本機快取（離線照用）*/
const CACHE = 'drv-app-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // 只接管App主頁本身；Firebase/Google等外部請求一律唔掂
  if (e.request.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('index.html'))) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).then(r => {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put('index.html', cp));
        return r;
      }).catch(() => caches.match('index.html'))
    );
  }
});

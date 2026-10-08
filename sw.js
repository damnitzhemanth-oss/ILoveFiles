const CACHE = 'ilovefiles-v2';
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './js/main.js',
    './js/state.js',
    './js/views.js',
    './js/theme.js',
    './js/dropzone.js',
    './js/filelist.js',
    './js/settings.js',
    './js/action.js',
    './js/converter.js',
    './js/conversion-core.js',
    './js/worker.js',
    './js/downloader.js',
    './js/presets.js',
    './js/compare.js',
    './js/zip.js',
    './js/loader.js',
    './js/format-support.js',
    './icons/favicon.png',
    './icons/heart.png',
    './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    if (url.origin !== location.origin) return;

    e.respondWith(
        caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
});
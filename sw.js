// Service worker: lưu toàn bộ game vào máy để chơi được khi không có mạng.
// MỖI LẦN PHÁT HÀNH BẢN MỚI: tăng số phiên bản dưới đây (ted-v2, ted-v3...), nếu không iPad vẫn chạy bản cũ.
const PHIEN_BAN = 'ted-v4';

const FILE_GAME = [
  './',
  './core/anh.js',
  './core/app.js',
  './core/art-vung2.js',
  './core/art.js',
  './core/audio.js',
  './core/dragdrop.js',
  './core/items.js',
  './core/map.js',
  './core/music.js',
  './core/rewards.js',
  './core/speech.js',
  './core/stickers.js',
  './core/storage.js',
  './data/levels.js',
  './fonts/baloo-2-latin-600-normal.woff2',
  './fonts/baloo-2-latin-700-normal.woff2',
  './fonts/baloo-2-latin-800-normal.woff2',
  './fonts/baloo-2-latin-ext-600-normal.woff2',
  './fonts/baloo-2-latin-ext-700-normal.woff2',
  './fonts/baloo-2-latin-ext-800-normal.woff2',
  './fonts/baloo-2-vietnamese-600-normal.woff2',
  './fonts/baloo-2-vietnamese-700-normal.woff2',
  './fonts/baloo-2-vietnamese-800-normal.woff2',
  './fonts/fonts.css',
  './fonts/nunito-latin-700-normal.woff2',
  './fonts/nunito-latin-800-normal.woff2',
  './fonts/nunito-latin-ext-700-normal.woff2',
  './fonts/nunito-latin-ext-800-normal.woff2',
  './fonts/nunito-vietnamese-700-normal.woff2',
  './fonts/nunito-vietnamese-800-normal.woff2',
  './games/chohang.js',
  './games/dem.js',
  './games/sosanh.js',
  './games/timso.js',
  './games/xepxe.js',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/logo.svg',
  './icons/ted.jpg',
  './index.html',
  './manifest.webmanifest',
  './style.css',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(PHIEN_BAN).then((c) => c.addAll(FILE_GAME)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ten) => Promise.all(ten.filter((t) => t !== PHIEN_BAN).map((t) => caches.delete(t))))
      .then(() => self.clients.claim()),
  );
});

// Lấy từ bộ nhớ máy trước; không có thì tải mạng rồi lưu lại.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((daLuu) => daLuu || fetch(e.request).then((res) => {
      if (res.ok && new URL(e.request.url).origin === self.location.origin) {
        const banSao = res.clone();
        caches.open(PHIEN_BAN).then((c) => c.put(e.request, banSao));
      }
      return res;
    })),
  );
});

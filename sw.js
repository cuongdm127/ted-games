// Service worker: lưu toàn bộ game vào máy để chơi được khi không có mạng.
// Khi có mạng game luôn lấy bản mới nhất. Tăng số phiên bản khi thêm/bớt file để bản lưu offline được làm mới.
const PHIEN_BAN = 'ted-v5';

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
  // cache: 'reload' để luôn tải bản mới từ máy chủ, không lấy bản cũ trong bộ nhớ đệm của trình duyệt.
  e.waitUntil(
    caches.open(PHIEN_BAN)
      .then((c) => c.addAll(FILE_GAME.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ten) => Promise.all(ten.filter((t) => t !== PHIEN_BAN).map((t) => caches.delete(t))))
      .then(() => self.clients.claim()),
  );
});

// Có mạng: lấy bản mới nhất từ máy chủ rồi cập nhật bộ nhớ máy.
// Mất mạng (hoặc mạng quá chậm): dùng bản đã lưu, nên vẫn chơi được offline.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const cungTrang = new URL(e.request.url).origin === self.location.origin;
  if (!cungTrang) return;
  e.respondWith((async () => {
    const cache = await caches.open(PHIEN_BAN);
    try {
      const res = await Promise.race([
        fetch(e.request, { cache: 'no-cache' }),
        new Promise((_, loi) => setTimeout(() => loi(new Error('cham')), 4000)),
      ]);
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    } catch (err) {
      const daLuu = await cache.match(e.request, { ignoreSearch: true });
      if (daLuu) return daLuu;
      throw err;
    }
  })());
});

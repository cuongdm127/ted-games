// Service worker: lưu toàn bộ game vào máy để mở nhanh và chơi được khi không có mạng.
// QUAN TRỌNG: mỗi lần sửa bất kỳ file nào của game phải tăng PHIEN_BAN,
// máy của bé mới tải bản mới (các file khác lấy thẳng từ bộ nhớ máy cho nhanh).
const PHIEN_BAN = 'ted-v10';

const FILE_GAME = [
  './',
  './core/anh.js',
  './core/app.js',
  './core/art-vung2.js',
  './core/art.js',
  './core/bome.js',
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
  './games/goibo.js',
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

// Trang chính (index.html): thử lấy bản mới từ mạng, chậm quá 2,5 giây thì dùng bản đã lưu.
// Các file còn lại (js, css, font, ảnh): lấy ngay từ bộ nhớ máy, không chờ mạng.
// Khi có bản mới, sw.js đổi PHIEN_BAN nên trình duyệt cài lại toàn bộ file.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  const laTrang = e.request.mode === 'navigate';

  e.respondWith((async () => {
    const cache = await caches.open(PHIEN_BAN);
    if (!laTrang) {
      const daLuu = await cache.match(e.request, { ignoreSearch: true });
      if (daLuu) return daLuu;
      const res = await fetch(e.request);
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    }
    try {
      const res = await Promise.race([
        fetch(e.request, { cache: 'no-cache' }),
        new Promise((_, loi) => setTimeout(() => loi(new Error('cham')), 2500)),
      ]);
      if (res.ok) cache.put('./index.html', res.clone());
      return res;
    } catch (err) {
      const daLuu = (await cache.match('./index.html')) || (await cache.match('./'));
      if (daLuu) return daLuu;
      throw err;
    }
  })());
});

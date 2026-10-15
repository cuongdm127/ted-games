// Ảnh thật của bé làm logo: chỉ lưu trên máy này (localStorage), không nằm trong code hay repo.
const KEY = 'ted-anh-be';
const CO = 360; // ảnh được cắt vuông 360 x 360

export function docAnh() {
  try {
    return localStorage.getItem(KEY);
  } catch (e) {
    return null;
  }
}

export function xoaAnh() {
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    // bỏ qua
  }
}

/**
 * Cắt ảnh vuông lấy phần mặt (ảnh chân dung thường có mặt ở giữa, hơi cao),
 * thu nhỏ rồi lưu. Trả về data URL, hoặc ném lỗi nếu không lưu được.
 */
export function luuAnhTuFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const canh = Math.round(Math.min(w, h) * (h > w ? 0.62 : 0.8));
      const tamX = w / 2;
      const tamY = h > w ? h * 0.4 : h / 2;
      const x = Math.max(0, Math.min(w - canh, tamX - canh / 2));
      const y = Math.max(0, Math.min(h - canh, tamY - canh / 2));
      const c = document.createElement('canvas');
      c.width = CO;
      c.height = CO;
      c.getContext('2d').drawImage(img, x, y, canh, canh, 0, 0, CO, CO);
      URL.revokeObjectURL(url);
      const data = c.toDataURL('image/jpeg', 0.85);
      try {
        localStorage.setItem(KEY, data);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Không đọc được ảnh'));
    };
    img.src = url;
  });
}

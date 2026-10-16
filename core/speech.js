let giongVi = null;

function chonGiong() {
  if (!('speechSynthesis' in window)) return;
  const list = window.speechSynthesis.getVoices();
  giongVi =
    list.find((v) => v.lang === 'vi-VN') ||
    list.find((v) => v.lang && v.lang.startsWith('vi')) ||
    null;
}

if ('speechSynthesis' in window) {
  chonGiong();
  window.speechSynthesis.onvoiceschanged = chonGiong;
}

let cauCuoi = '';
let henGioXong = null;

export function noi(text) {
  if (!('speechSynthesis' in window)) return;
  cauCuoi = text;
  // Không có giọng tiếng Việt thì im lặng, tránh đọc sai thành giọng tiếng Anh
  // (chữ trong bong bóng Rex vẫn hiển thị để bố mẹ đọc hộ).
  if (!giongVi) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'vi-VN';
  utter.voice = giongVi;
  utter.rate = 0.95;
  utter.pitch = 1.05;
  // Báo cho nhạc nền nhỏ lại khi Rex nói. Có hẹn giờ dự phòng vì
  // một số trình duyệt không gọi onend.
  clearTimeout(henGioXong);
  const baoXong = () => {
    clearTimeout(henGioXong);
    window.dispatchEvent(new Event('rex-noi-xong'));
  };
  utter.onend = baoXong;
  utter.onerror = baoXong;
  henGioXong = setTimeout(baoXong, 1500 + text.length * 110);
  window.dispatchEvent(new Event('rex-bat-dau-noi'));
  window.speechSynthesis.speak(utter);
}

/** Máy có giọng đọc tiếng Việt không (danh sách giọng có thể tải chậm, nên hỏi sau vài giây). */
export function coGiongViet() {
  if (!('speechSynthesis' in window)) return false;
  if (!giongVi) chonGiong();
  return !!giongVi;
}

export function noiLai() {
  if (cauCuoi) noi(cauCuoi);
}

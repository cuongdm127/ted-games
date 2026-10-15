// Nhạc nền tự tạo bằng Web Audio API (không cần file nhạc, chạy được offline).
// Hai bài: 'ban-do' (nhẹ nhàng, khi ở bản đồ) và 'choi' (vui nhộn hơn, khi đang chơi).
// Nhạc tự nhỏ lại khi Rex đang nói, và nhớ lựa chọn bật/tắt của bé.

import { layAudioCtx } from './audio.js';

const KEY = 'ted-nhac';
const AM_LUONG = 0.7;    // âm lượng nhạc nền (vẫn nhỏ hơn tiếng hiệu ứng)
const KHI_REX_NOI = 0.3; // còn 30% khi Rex nói

const BAI = {
  'ban-do': {
    nhip: 96,
    giai: `
      C5 - E5 - G5 - E5 -   A4 - C5 - E5 - C5 -   F4 - A4 - C5 - A4 D5   B4 - D5 - G5 - - -
      E5 E5 G5 - E5 - C5 -  A4 - C5 E5 - D5 C5 -  D5 - F5 - A5 - G5 F5   E5 - D5 - C5 - - -`,
    tram: `
      C3 - - - G2 - - -     A2 - - - E2 - - -     F2 - - - C3 - - -     G2 - - - D3 - - -
      C3 - - - G2 - - -     A2 - - - E2 - - -     F2 - - - C3 - - -     G2 - - - C3 - - -`,
    trong: false,
  },
  choi: {
    nhip: 120,
    giai: `
      C5 - C5 E5 G5 - E5 -  F5 - E5 D5 C5 - A4 -  B4 - D5 - G5 - F5 E5  E5 - C5 - - - G4 -
      C5 - E5 G5 C6 - G5 -  A5 - G5 F5 E5 - D5 -  D5 - B4 - G4 - B4 D5  C5 - - - C5 - - -`,
    tram: `
      C3 - - - G2 - C3 -    F2 - - - C3 - F2 -    G2 - - - D3 - G2 -    C3 - - - G2 - C3 -
      C3 - - - G2 - C3 -    F2 - - - C3 - F2 -    G2 - - - D3 - G2 -    C3 - G2 - C3 - - -`,
    trong: true,
  },
};

const TEN_NOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

function tanSo(not) {
  const m = /^([A-G])(#?)(\d)$/.exec(not);
  if (!m) return null;
  const midi = 12 * (Number(m[3]) + 1) + TEN_NOT[m[1]] + (m[2] ? 1 : 0);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function tach(chuoi) {
  return chuoi.trim().split(/\s+/).map((t) => (t === '-' ? null : tanSo(t)));
}

for (const bai of Object.values(BAI)) {
  bai.giaiHz = tach(bai.giai);
  bai.tramHz = tach(bai.tram);
}

let ctx = null;
let tong = null;      // gain tổng của nhạc nền
let tiengXao = null;  // bộ đệm tiếng "xào xạc" cho trống nhẹ
let baiHienTai = null;
let baiMuonPhat = 'ban-do';
let buoc = 0;
let thoiDiemTiep = 0;
let henGio = null;
let dangNoi = false;
let batNhac = docCaiDat();

function docCaiDat() {
  try {
    return localStorage.getItem(KEY) !== 'tat';
  } catch (e) {
    return true;
  }
}

function ghiCaiDat() {
  try {
    localStorage.setItem(KEY, batNhac ? 'bat' : 'tat');
  } catch (e) {
    // bỏ qua nếu không lưu được
  }
}

function chuanBi() {
  if (ctx) return true;
  ctx = layAudioCtx();
  if (!ctx) return false;
  tong = ctx.createGain();
  tong.gain.value = 0;
  tong.connect(ctx.destination);

  const dai = Math.floor(ctx.sampleRate * 0.1);
  tiengXao = ctx.createBuffer(1, dai, ctx.sampleRate);
  const d = tiengXao.getChannelData(0);
  for (let i = 0; i < dai; i++) d[i] = Math.random() * 2 - 1;
  return true;
}

function amLuongMucTieu() {
  if (!batNhac || document.hidden) return 0;
  return AM_LUONG * (dangNoi ? KHI_REX_NOI : 1);
}

function chinhAmLuong(thoiGian = 0.25) {
  if (!tong) return;
  const t = ctx.currentTime;
  tong.gain.cancelScheduledValues(t);
  tong.gain.setValueAtTime(tong.gain.value, t);
  tong.gain.linearRampToValueAtTime(amLuongMucTieu(), t + thoiGian);
}

function notGiai(hz, t, dai) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.22, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.001, t + dai * 1.6);
  g.connect(tong);

  const o1 = ctx.createOscillator();
  o1.type = 'triangle';
  o1.frequency.value = hz;
  o1.connect(g);

  // một chút tiếng chuông ở quãng tám trên cho trong trẻo
  const g2 = ctx.createGain();
  g2.gain.value = 0.25;
  g2.connect(g);
  const o2 = ctx.createOscillator();
  o2.type = 'sine';
  o2.frequency.value = hz * 2;
  o2.connect(g2);

  o1.start(t); o2.start(t);
  o1.stop(t + dai * 1.7); o2.stop(t + dai * 1.7);
}

function notTram(hz, t, dai) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.34, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.001, t + dai * 3);
  g.connect(tong);
  const o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.value = hz;
  o.connect(g);
  o.start(t);
  o.stop(t + dai * 3.1);
}

function trongNhe(t) {
  const nguon = ctx.createBufferSource();
  nguon.buffer = tiengXao;
  const loc = ctx.createBiquadFilter();
  loc.type = 'highpass';
  loc.frequency.value = 7000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.07, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  nguon.connect(loc);
  loc.connect(g);
  g.connect(tong);
  nguon.start(t);
  nguon.stop(t + 0.06);
}

function lapLich() {
  const bai = BAI[baiHienTai];
  const nuaPhach = 60 / bai.nhip / 2;
  while (thoiDiemTiep < ctx.currentTime + 0.15) {
    const i = buoc % bai.giaiHz.length;
    if (bai.giaiHz[i]) notGiai(bai.giaiHz[i], thoiDiemTiep, nuaPhach);
    if (bai.tramHz[i]) notTram(bai.tramHz[i], thoiDiemTiep, nuaPhach);
    if (bai.trong && i % 2 === 1) trongNhe(thoiDiemTiep);
    thoiDiemTiep += nuaPhach;
    buoc++;
  }
}

function batDauPhat() {
  if (henGio || !batNhac || document.hidden) return;
  if (!chuanBi()) return;
  if (ctx.state === 'suspended') ctx.resume();
  baiHienTai = baiMuonPhat;
  buoc = 0;
  thoiDiemTiep = ctx.currentTime + 0.08;
  henGio = setInterval(lapLich, 25);
  lapLich();
  chinhAmLuong(0.6);
}

function dungPhat() {
  if (henGio) {
    clearInterval(henGio);
    henGio = null;
  }
  chinhAmLuong(0.15);
}

/** Gọi sau lần chạm đầu tiên (iOS chỉ cho phát tiếng sau khi bé chạm). */
export function khoiDongNhac() {
  batDauPhat();
}

/** Đổi bài: 'ban-do' hoặc 'choi'. Đổi mượt, không giật. */
export function chonBai(ten) {
  if (!BAI[ten] || ten === baiMuonPhat) return;
  baiMuonPhat = ten;
  if (!henGio) return;
  const t = ctx.currentTime;
  tong.gain.cancelScheduledValues(t);
  tong.gain.setValueAtTime(tong.gain.value, t);
  tong.gain.linearRampToValueAtTime(0, t + 0.3);
  clearInterval(henGio);
  henGio = null;
  setTimeout(batDauPhat, 350);
}

export function nhacDangBat() {
  return batNhac;
}

export function batTatNhac() {
  batNhac = !batNhac;
  ghiCaiDat();
  if (batNhac) batDauPhat();
  else dungPhat();
  return batNhac;
}

// Rex nói thì nhạc nhỏ lại cho bé nghe rõ.
window.addEventListener('rex-bat-dau-noi', () => {
  dangNoi = true;
  chinhAmLuong(0.2);
});
window.addEventListener('rex-noi-xong', () => {
  dangNoi = false;
  chinhAmLuong(0.6);
});

// Chuyển sang ứng dụng khác hoặc khoá màn hình thì tắt nhạc, quay lại thì phát tiếp.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) dungPhat();
  else if (ctx) batDauPhat();
});

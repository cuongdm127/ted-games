// Góc bố mẹ: thời gian chơi mỗi ngày, thống kê Ted hay vướng ở đâu, đề do bố mẹ tự ra.
// Mọi thứ chỉ lưu trên máy này (localStorage). Chế độ thử (?test) lưu riêng.
import { CHE_DO_THU } from './storage.js';
import { dem, congHinh, soSanh, chonDau } from '../data/levels.js';

const HAU_TO = CHE_DO_THU ? '-test' : '';
const K_CAI_DAT = `ted-cai-dat${HAU_TO}`;
const K_THOI_GIAN = `ted-thoi-gian${HAU_TO}`;
const K_THONG_KE = `ted-thong-ke${HAU_TO}`;
const K_DE = `ted-de-cua-bo${HAU_TO}`;

function doc(k, macDinh) {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : macDinh;
  } catch (e) {
    return macDinh;
  }
}
function ghi(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) {
    // bỏ qua nếu máy không lưu được
  }
}

const homNay = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// ---------- Thời gian chơi ----------
export const LUA_CHON_PHUT = [0, 10, 15, 20, 30];

export function caiDat() {
  return { phutMoiNgay: 0, ...doc(K_CAI_DAT, {}) };
}
export function datPhutMoiNgay(phut) {
  ghi(K_CAI_DAT, { ...caiDat(), phutMoiNgay: phut });
}

function thoiGianHomNay() {
  const t = doc(K_THOI_GIAN, {});
  return t.ngay === homNay() ? { giay: 0, them: 0, ...t } : { ngay: homNay(), giay: 0, them: 0 };
}
export function congGiayChoi(giay) {
  const t = thoiGianHomNay();
  t.giay += giay;
  ghi(K_THOI_GIAN, t);
}
export function choChoiThem(phut) {
  const t = thoiGianHomNay();
  t.them += phut;
  ghi(K_THOI_GIAN, t);
}
export function phutDaChoiHomNay() {
  return Math.floor(thoiGianHomNay().giay / 60);
}
/** Số phút còn được chơi hôm nay; null nếu không giới hạn. */
export function phutConLai() {
  const { phutMoiNgay } = caiDat();
  if (!phutMoiNgay) return null;
  const t = thoiGianHomNay();
  return Math.max(0, Math.ceil(((phutMoiNgay + t.them) * 60 - t.giay) / 60));
}
export function hetGio() {
  const { phutMoiNgay } = caiDat();
  if (!phutMoiNgay) return false;
  const t = thoiGianHomNay();
  return t.giay >= (phutMoiNgay + t.them) * 60;
}

// ---------- Thống kê ----------
export const TEN_LOAI = {
  dem: 'Đếm lá cho khủng long',
  goibo: 'Gói bó 10 lá',
  timso: 'Tìm số trên trứng',
  cong: 'Phép cộng',
  sosanh: 'Bãi nào nhiều / ít xe hơn',
  dau: 'Chọn dấu < = >',
  chohang: 'Chục và đơn vị (chở hàng)',
  xepxe: 'Xếp từ nhỏ đến lớn',
};

export function loaiCau(c) {
  if (c.kieu === 'timso') return c.phepTinh ? 'cong' : 'timso';
  if (c.kieu === 'sosanh') return c.chon === 'dau' ? 'dau' : 'sosanh';
  return c.kieu;
}

/** Ghi lại một câu vừa xong: số lần sai và có cần Rex làm mẫu không. */
export function ghiCau(cauData, soLanSai, lamMau) {
  const tk = doc(K_THONG_KE, { loai: {}, vuong: [] });
  const k = loaiCau(cauData);
  const l = tk.loai[k] || { cau: 0, dungNgay: 0, lamMau: 0 };
  l.cau += 1;
  if (soLanSai === 0) l.dungNgay += 1;
  if (lamMau) l.lamMau += 1;
  tk.loai[k] = l;
  if (soLanSai > 0) {
    tk.vuong.unshift({ hoi: cauData.hoi, sai: soLanSai, lamMau, ngay: homNay() });
    tk.vuong = tk.vuong.slice(0, 8);
  }
  ghi(K_THONG_KE, tk);
}
export function docThongKe() {
  return doc(K_THONG_KE, { loai: {}, vuong: [] });
}
export function xoaThongKe() {
  ghi(K_THONG_KE, { loai: {}, vuong: [] });
}

// ---------- Đề của bố mẹ ----------
// Mỗi đề lưu gọn: { k: 'cong', a, b } | { k: 'dau', a, b } | { k: 'nhieu', a, b } | { k: 'dem', n }
export const TEN_KIEU_DE = {
  cong: 'Phép cộng a + b',
  dau: 'Chọn dấu a ? b',
  nhieu: 'Bãi nào nhiều xe hơn',
  dem: 'Đếm lá (một số)',
};

export function danhSachDe() {
  return doc(K_DE, []);
}
export function themDe(de) {
  const ds = danhSachDe();
  ds.push(de);
  ghi(K_DE, ds.slice(-20));
}
export function xoaDe(i) {
  const ds = danhSachDe();
  ds.splice(i, 1);
  ghi(K_DE, ds);
}
export function xoaHetDe() {
  ghi(K_DE, []);
}

/** Kiểm tra số bố mẹ nhập; trả về lỗi (chuỗi) hoặc null. */
export function kiemTraDe(de) {
  const so = (x) => Number.isInteger(x);
  if (de.k === 'cong') return so(de.a) && so(de.b) && de.a >= 0 && de.b >= 0 && de.a <= 9 && de.b <= 9 ? null : 'Phép cộng: mỗi số từ 0 đến 9 (Ted mới cộng số có một chữ số).';
  if (de.k === 'dem') return so(de.n) && de.n >= 1 && de.n <= 60 ? null : 'Đếm lá: chọn số từ 1 đến 60.';
  if (!(so(de.a) && so(de.b) && de.a >= 0 && de.b >= 0 && de.a <= 99 && de.b <= 99)) return 'So sánh: mỗi số từ 0 đến 99.';
  if (de.k === 'nhieu' && de.a === de.b) return 'Bãi nhiều xe hơn: hai số phải khác nhau.';
  return null;
}

export function moTaDe(de) {
  if (de.k === 'cong') return `${de.a} + ${de.b} = ?`;
  if (de.k === 'dau') return `${de.a} ? ${de.b} (chọn dấu)`;
  if (de.k === 'nhieu') return `${de.a} hay ${de.b}: bãi nào nhiều xe hơn`;
  return `Cho khủng long ăn ${de.n} lá`;
}

const ngauNhien = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

/** Đổi đề gọn thành câu hỏi giống các màn có sẵn. */
export function taoCauTuDe(de) {
  if (de.k === 'cong') {
    const s = de.a + de.b;
    const chon = [s, s + 1, s > 0 ? s - 1 : s + 2];
    return congHinh(de.a, de.b, chon);
  }
  if (de.k === 'dau') return chonDau(de.a, de.b);
  if (de.k === 'nhieu') return soSanh(de.a, de.b, 'lon');
  return dem(de.n, Math.floor(de.n / 10), (de.n % 10) + 3, 1);
}

/** Năm câu ngẫu nhiên vừa sức Ted. */
export function deNgauNhien() {
  const ds = [];
  ds.push({ k: 'cong', a: ngauNhien(1, 9), b: ngauNhien(1, 9) });
  ds.push({ k: 'cong', a: ngauNhien(2, 9), b: ngauNhien(1, 5) });
  let a = ngauNhien(10, 99);
  let b = ngauNhien(10, 99);
  if (a === b) b = (b + 7) % 90 + 10;
  ds.push({ k: 'dau', a, b });
  const c = ngauNhien(5, 40);
  ds.push({ k: 'nhieu', a: c, b: c + ngauNhien(1, 9) * (Math.random() < 0.5 ? 1 : -1) + (c < 10 ? 10 : 0) });
  ds.push({ k: 'dem', n: ngauNhien(12, 45) });
  return ds;
}

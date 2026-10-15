// Danh mục đồ cho Ted và xe. Thêm đồ mới: thêm vào DO và THU_TU_RUONG.
// o: ô đồ (mỗi ô mặc/gắn một món). boDuoc: bấm lại để tháo ra được.

export const O_DO = {
  ao: { tab: 'ted', boDuoc: false },
  matNa: { tab: 'ted', boDuoc: false },
  khien: { tab: 'ted', boDuoc: true },
  mu: { tab: 'ted', boDuoc: true },
  giay: { tab: 'ted', boDuoc: true },
  son: { tab: 'xe', boDuoc: false },
  banh: { tab: 'xe', boDuoc: true },
  canh: { tab: 'xe', boDuoc: true },
  den: { tab: 'xe', boDuoc: true },
};

export const DO = {
  'ao-do': { ten: 'Áo choàng đỏ', o: 'ao' },
  'ao-lua': { ten: 'Áo choàng lửa', o: 'ao' },
  'ao-xanh': { ten: 'Áo choàng sao', o: 'ao' },
  'mat-na-xanh': { ten: 'Mặt nạ xanh', o: 'matNa' },
  'mat-na-vang': { ten: 'Mặt nạ vàng', o: 'matNa' },
  'khien-sao': { ten: 'Khiên sao', o: 'khien' },
  'mu-phi-cong': { ten: 'Mũ phi công', o: 'mu' },
  'giay-ten-lua': { ten: 'Giày tên lửa', o: 'giay' },
  'son-do': { ten: 'Xe đỏ', o: 'son' },
  'son-xanh': { ten: 'Sơn xanh', o: 'son' },
  'banh-lua': { ten: 'Bánh lửa', o: 'banh' },
  'canh-bay': { ten: 'Cánh bay', o: 'canh' },
  'den-sieu-sang': { ten: 'Đèn siêu sáng', o: 'den' },
};

export const DO_CO_SAN = ['ao-do', 'mat-na-xanh', 'son-do'];
export const DO_MAC_DINH = { ao: 'ao-do', matNa: 'mat-na-xanh', son: 'son-do', khien: null, mu: null, giay: null, banh: null, canh: null, den: null };

// Thứ tự đồ nhận được từ rương (Ted và xe xen kẽ để bé luôn có cái mới để thử).
export const THU_TU_RUONG = [
  'ao-lua', 'banh-lua', 'mat-na-vang', 'canh-bay', 'khien-sao',
  'ao-xanh', 'den-sieu-sang', 'mu-phi-cong', 'son-xanh', 'giay-ten-lua',
];

export const SAO_MOT_RUONG = 10;

/** Đồ sẽ nhận ở rương tiếp theo (null nếu đã có hết). */
export function doTiepTheo(doDaCo) {
  return THU_TU_RUONG.find((id) => !doDaCo.includes(id)) || null;
}

/** Số rương đang chờ mở. */
export function soRuongCho(tongSao, ruongDaMo, doDaCo) {
  if (!doTiepTheo(doDaCo)) return 0;
  return Math.max(0, Math.floor(tongSao / SAO_MOT_RUONG) - ruongDaMo);
}

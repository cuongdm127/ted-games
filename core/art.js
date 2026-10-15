// Hình vẽ SVG dùng chung cho cả game (nhân vật, đồ vật, biểu tượng).
// Mỗi hàm trả về chuỗi <svg>; kích thước do CSS của phần tử chứa quyết định.

const INK = '#24324A';

export function rex({ cuoiTo = false, nhay = false } = {}) {
  const mieng = cuoiTo
    ? '<path d="M68 56 Q86 74 102 54Z" fill="#8E2F3A"/>'
    : `<path d="M70 58 Q86 68 100 56" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const mat = cuoiTo
    ? `<path d="M76 40 Q82 34 88 40" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : `<circle cx="82" cy="40" r="8" fill="#fff"/><circle cx="84" cy="41" r="4" fill="${INK}"/>`;
  const tay = nhay
    ? '<path d="M78 74 L94 60 M42 74 L30 58" stroke="#43A856" stroke-width="7" stroke-linecap="round"/>'
    : '<path d="M76 82 L90 74" stroke="#43A856" stroke-width="7" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 120 136" aria-hidden="true">
    <path d="M30 100 Q2 100 6 80 Q22 92 40 88Z" fill="#43A856"/>
    <ellipse cx="56" cy="92" rx="30" ry="28" fill="#5CC36A"/>
    <ellipse cx="60" cy="98" rx="17" ry="17" fill="#D6F5C4"/>
    <rect x="38" y="110" width="14" height="20" rx="7" fill="#43A856"/>
    <rect x="62" y="110" width="14" height="20" rx="7" fill="#43A856"/>
    <path d="M44 36 L48 22 L56 34Z M36 52 L36 38 L46 46Z" fill="#FF7A30"/>
    <ellipse cx="72" cy="48" rx="32" ry="26" fill="#5CC36A"/>
    ${mat}${mieng}${tay}
  </svg>`;
}

export function rexMat() {
  return `<svg viewBox="38 14 72 72" aria-hidden="true">
    <path d="M44 36 L48 22 L56 34Z M36 52 L36 38 L46 46Z" fill="#FF7A30"/>
    <ellipse cx="56" cy="92" rx="30" ry="28" fill="#5CC36A"/>
    <ellipse cx="72" cy="48" rx="32" ry="26" fill="#5CC36A"/>
    <circle cx="82" cy="40" r="8" fill="#fff"/><circle cx="84" cy="41" r="4" fill="${INK}"/>
    <path d="M70 58 Q86 68 100 56" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}

// Khủng long cổ dài, có vòng nét đứt quanh miệng để bé biết thả lá vào đâu.
export function khungLongCoDai() {
  return `<svg viewBox="0 0 214 236" aria-hidden="true">
    <path d="M40 176 Q0 184 4 156 Q20 170 50 161Z" fill="#4FA9C2"/>
    <rect x="44" y="182" width="20" height="46" rx="10" fill="#4FA9C2"/>
    <rect x="104" y="182" width="20" height="46" rx="10" fill="#4FA9C2"/>
    <ellipse cx="85" cy="166" rx="60" ry="40" fill="#6CC4D9"/>
    <ellipse cx="88" cy="182" rx="38" ry="16" fill="#BDEAF3"/>
    <circle cx="66" cy="146" r="7" fill="#4FA9C2"/><circle cx="92" cy="136" r="5" fill="#4FA9C2"/><circle cx="110" cy="154" r="4" fill="#4FA9C2"/>
    <rect x="62" y="186" width="20" height="46" rx="10" fill="#6CC4D9"/>
    <rect x="122" y="184" width="20" height="46" rx="10" fill="#6CC4D9"/>
    <path d="M118 146 Q146 116 146 62" stroke="#6CC4D9" stroke-width="30" fill="none" stroke-linecap="round"/>
    <ellipse cx="154" cy="50" rx="28" ry="20" fill="#6CC4D9"/>
    <g class="mieng"><ellipse cx="172" cy="60" rx="10" ry="8" fill="#8E2F3A"/><ellipse cx="172" cy="64" rx="6" ry="3.5" fill="#F48FA0"/></g>
    <circle cx="152" cy="42" r="6" fill="#fff"/><circle cx="153.5" cy="43" r="3" fill="${INK}"/>
    <circle cx="140" cy="56" r="4" fill="#F7B6C2" fill-opacity="0.8"/>
    <circle class="vong-mieng" cx="168" cy="52" r="40" fill="rgba(255,216,74,0.18)" stroke="#FFC21A" stroke-width="4" stroke-dasharray="9 7"/>
  </svg>`;
}

const MAU_AO = { 'ao-do': '#E8443A', 'ao-lua': '#E8443A', 'ao-xanh': '#3B82F6' };
const MAU_MAT_NA = { 'mat-na-xanh': '#1F4FD1', 'mat-na-vang': '#FFC21A' };
const MAU_SON = { 'son-do': '#E8443A', 'son-xanh': '#3B82F6' };
const MAC_DINH = { ao: 'ao-do', matNa: 'mat-na-xanh', son: 'son-do' };

/** Xe siêu tốc của Ted, vẽ thêm đồ nâng cấp đang gắn (bánh lửa, cánh bay, đèn siêu sáng, màu sơn). */
export function xeTed(doMac = MAC_DINH) {
  const son = MAU_SON[doMac.son] || '#E8443A';
  const ao = MAU_AO[doMac.ao] || '#E8443A';
  const matNa = MAU_MAT_NA[doMac.matNa] || '#1F4FD1';
  const canh = doMac.canh === 'canh-bay'
    ? `<path d="M30 34 Q14 6 -6 2 Q4 18 8 30Z" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M8 14 L20 26 M2 8 L16 28" stroke="#BFE6FF" stroke-width="2"/>`
    : '';
  const den = doMac.den === 'den-sieu-sang'
    ? '<path d="M94 38 L118 28 L118 54 L94 46Z" fill="#FFE68A" fill-opacity="0.75"/><circle cx="92" cy="42" r="5" fill="#FFF3B0" stroke="#24324A" stroke-width="2"/>'
    : '';
  const banh = (cx) => doMac.banh === 'banh-lua'
    ? `<path d="M${cx - 14} 60 Q${cx - 24} 52 ${cx - 20} 44 Q${cx - 14} 52 ${cx - 8} 48 Q${cx - 10} 56 ${cx - 2} 58Z" fill="#FF7A30"/><circle cx="${cx}" cy="58" r="11" fill="${INK}"/><circle cx="${cx}" cy="58" r="6" fill="#FFC21A"/><circle cx="${cx}" cy="58" r="2.5" fill="#E8443A"/>`
    : `<circle cx="${cx}" cy="58" r="11" fill="${INK}"/><circle cx="${cx}" cy="58" r="4" fill="#C8D0DC"/>`;
  return `<svg viewBox="-12 -8 132 84" aria-hidden="true">
    ${den}${canh}
    <path d="M40 18 Q20 22 14 40 L34 34Z" fill="${ao}"/>
    <path d="M30 34 Q34 14 54 12 Q72 12 76 34Z" fill="#BFE6FF" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="54" cy="22" r="11" fill="#FFD3A8"/>
    <path d="M43 18 Q54 6 65 18 L65 15 Q54 3 43 15Z" fill="#5A3A22"/>
    <rect x="43" y="19" width="22" height="7" rx="3.5" fill="${matNa}"/>
    <circle cx="50" cy="22.5" r="1.8" fill="#fff"/><circle cx="58" cy="22.5" r="1.8" fill="#fff"/>
    <rect x="6" y="32" width="88" height="24" rx="12" fill="${son}" stroke="${INK}" stroke-width="3"/>
    <path d="M46 37 L40 46 L48 46 L44 53 L55 42 L48 42 L52 37Z" fill="#FFC21A"/>
    ${banh(26)}${banh(76)}
  </svg>`;
}

export function tedMat(doMac = MAC_DINH) {
  const matNa = MAU_MAT_NA[doMac.matNa] || '#1F4FD1';
  return `<svg viewBox="0 0 56 56" aria-hidden="true">
    <rect width="56" height="56" fill="#FFD3A8"/>
    <path d="M8 20 Q28 0 48 20 L48 16 Q28 -4 8 16Z" fill="#5A3A22"/>
    <rect x="8" y="22" width="40" height="12" rx="6" fill="${matNa}"/>
    <circle cx="20" cy="28" r="4" fill="#fff"/><circle cx="36" cy="28" r="4" fill="#fff"/>
    <circle cx="20" cy="28" r="2" fill="${INK}"/><circle cx="36" cy="28" r="2" fill="${INK}"/>
    <path d="M20 42 Q28 48 36 42" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`;
}

function hinhAo(id) {
  const mau = MAU_AO[id] || '#E8443A';
  const hoaVan = id === 'ao-lua'
    ? '<path d="M100 66 Q80 96 88 120 Q100 136 112 120 Q120 96 100 66Z" fill="#FFC21A"/><path d="M100 92 Q92 106 96 118 Q100 124 104 118 Q108 106 100 92Z" fill="#FF7A30"/>'
    : id === 'ao-xanh'
      ? '<path d="M100 70 l9 19 21 2 -16 14 5 21 -19 -11 -19 11 5 -21 -16 -14 21 -2z" fill="#FFFFFF"/>'
      : '';
  return { mau, hoaVan };
}

/** Ted đứng, mặc đồ đang chọn (dùng ở tủ đồ). */
export function tedToanThan(doMac = MAC_DINH) {
  const { mau: ao, hoaVan } = hinhAo(doMac.ao);
  const matNa = MAU_MAT_NA[doMac.matNa] || '#1F4FD1';
  // Hoa văn áo choàng hiện ở hai vạt áo hai bên người.
  const hoaVanAo = hoaVan
    ? `<g transform="translate(10 190) scale(0.42)">${hoaVan}</g><g transform="translate(106 190) scale(0.42)">${hoaVan}</g>`
    : '';
  const giay = doMac.giay === 'giay-ten-lua'
    ? '<path d="M64 276 Q70 290 80 284 M120 276 Q126 290 136 284" stroke="#FF7A30" stroke-width="6" stroke-linecap="round" fill="none"/><rect x="68" y="248" width="32" height="26" rx="12" fill="#C8D0DC" stroke="#24324A" stroke-width="2.5"/><rect x="100" y="248" width="32" height="26" rx="12" fill="#C8D0DC" stroke="#24324A" stroke-width="2.5"/>'
    : '<rect x="70" y="250" width="30" height="24" rx="12" fill="#E8443A"/><rect x="100" y="250" width="30" height="24" rx="12" fill="#E8443A"/>';
  const khien = doMac.khien === 'khien-sao'
    ? '<g transform="translate(132 150)"><path d="M22 0 L44 8 Q44 40 22 56 Q0 40 0 8Z" fill="#3B82F6" stroke="#FFFFFF" stroke-width="3"/><path d="M22 14 l4.5 9.5 10.5 1 -8 7 2.5 10.5 -9.5 -5.5 -9.5 5.5 2.5 -10.5 -8 -7 10.5 -1z" fill="#FFC21A"/></g>'
    : '';
  const mu = doMac.mu === 'mu-phi-cong'
    ? '<path d="M58 58 Q60 20 100 20 Q140 20 142 58 Q120 40 100 40 Q80 40 58 58Z" fill="#8A5A33" stroke="#24324A" stroke-width="2.5"/><rect x="76" y="26" width="48" height="14" rx="7" fill="#BFE6FF" stroke="#24324A" stroke-width="2.5"/>'
    : '<path d="M60 60 Q66 20 100 22 Q134 20 140 60 Q128 40 100 40 Q74 40 60 60Z" fill="#5A3A22"/>';
  return `<svg viewBox="0 0 200 300" aria-hidden="true">
    <path d="M62 110 Q30 200 24 272 Q68 256 100 274 Q132 256 176 272 Q170 200 138 110Z" fill="${ao}" stroke="#24324A" stroke-opacity="0.25" stroke-width="3" stroke-linejoin="round"/>
    ${hoaVanAo}
    <rect x="78" y="196" width="18" height="62" rx="9" fill="#2F6BFF"/>
    <rect x="104" y="196" width="18" height="62" rx="9" fill="#2F6BFF"/>
    ${giay}
    <rect x="66" y="108" width="68" height="100" rx="28" fill="#2F6BFF"/>
    <rect x="66" y="186" width="68" height="12" fill="#FFC21A"/>
    <path d="M100 128 l6.5 13.5 15 1.5 -11.3 10 3.3 14.8 -13.5 -7.5 -13.5 7.5 3.3 -14.8 -11.3 -10 15 -1.5z" fill="#FFC21A" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
    <path d="M72 124 L44 88" stroke="#2F6BFF" stroke-width="18" stroke-linecap="round"/>
    <circle cx="42" cy="84" r="12" fill="#FFD3A8"/>
    <path d="M128 124 L150 172" stroke="#2F6BFF" stroke-width="18" stroke-linecap="round"/>
    <circle cx="152" cy="178" r="11" fill="#FFD3A8"/>
    ${khien}
    <rect x="74" y="100" width="52" height="14" rx="7" fill="#FFC21A"/>
    <circle cx="100" cy="66" r="40" fill="#FFD3A8"/>
    ${mu}
    <rect x="62" y="54" width="76" height="20" rx="10" fill="${matNa}"/>
    <circle cx="84" cy="64" r="6.5" fill="#fff"/><circle cx="116" cy="64" r="6.5" fill="#fff"/>
    <circle cx="85" cy="64" r="3.2" fill="${INK}"/><circle cx="117" cy="64" r="3.2" fill="${INK}"/>
    <path d="M86 86 Q100 96 114 86" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
  </svg>`;
}

/** Hình nhỏ của từng món đồ (tủ đồ, rương quà). */
export function hinhDo(id, khoa = false) {
  const xam = '#E4DCCB';
  if (id.startsWith('ao-')) {
    const { mau, hoaVan } = hinhAo(id);
    return `<svg viewBox="0 0 200 184" aria-hidden="true"><path d="M60 22 Q30 100 18 172 Q60 152 100 174 Q140 152 182 172 Q170 100 140 22Z" fill="${khoa ? xam : mau}"/>${khoa ? '' : hoaVan}<rect x="54" y="10" width="92" height="18" rx="9" fill="${khoa ? '#D3C8B2' : '#FFC21A'}"/></svg>`;
  }
  if (id.startsWith('mat-na-')) {
    const mau = khoa ? xam : MAU_MAT_NA[id];
    return `<svg viewBox="0 0 120 64" aria-hidden="true"><path d="M6 22 Q60 0 114 22 Q116 50 86 54 Q70 54 60 42 Q50 54 34 54 Q4 50 6 22Z" fill="${mau}" stroke="${khoa ? '#D3C8B2' : INK}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="36" cy="32" rx="12" ry="9" fill="#fff"/><ellipse cx="84" cy="32" rx="12" ry="9" fill="#fff"/></svg>`;
  }
  if (id === 'khien-sao') {
    return `<svg viewBox="0 0 90 100" aria-hidden="true"><path d="M45 4 L84 18 Q84 70 45 96 Q6 70 6 18Z" fill="${khoa ? xam : '#3B82F6'}" stroke="${khoa ? '#D3C8B2' : INK}" stroke-width="3"/>${khoa ? '' : '<path d="M45 26 l8 17 19 2 -14 12 4 19 -17 -10 -17 10 4 -19 -14 -12 19 -2z" fill="#FFC21A"/>'}</svg>`;
  }
  if (id === 'mu-phi-cong') {
    return `<svg viewBox="0 0 100 80" aria-hidden="true"><path d="M10 60 Q10 8 50 8 Q90 8 90 60Z" fill="${khoa ? xam : '#8A5A33'}" stroke="${khoa ? '#D3C8B2' : INK}" stroke-width="3"/><rect x="22" y="30" width="56" height="18" rx="9" fill="${khoa ? '#D3C8B2' : '#BFE6FF'}" stroke="${khoa ? '#D3C8B2' : INK}" stroke-width="3"/></svg>`;
  }
  if (id === 'giay-ten-lua') {
    return `<svg viewBox="0 0 110 70" aria-hidden="true"><path d="M20 10 L50 10 L54 40 Q90 40 96 58 L20 58Z" fill="${khoa ? xam : '#C8D0DC'}" stroke="${khoa ? '#D3C8B2' : INK}" stroke-width="3" stroke-linejoin="round"/>${khoa ? '' : '<path d="M18 52 Q4 60 8 68 Q12 60 20 62 Q16 66 22 70" fill="#FF7A30"/>'}</svg>`;
  }
  // Đồ của xe: vẽ chiếc xe chỉ có món đó.
  const chiMotMon = { son: 'son-do' };
  if (id.startsWith('son-')) chiMotMon.son = id;
  else chiMotMon[{ 'banh-lua': 'banh', 'canh-bay': 'canh', 'den-sieu-sang': 'den' }[id]] = id;
  const svg = xeTed({ ao: 'ao-do', matNa: 'mat-na-xanh', ...chiMotMon });
  return khoa ? svg.replace('<svg ', '<svg style="filter: grayscale(1) opacity(0.35)" ') : svg;
}

export function la() {
  return `<svg viewBox="0 0 60 60" aria-hidden="true">
    <path d="M8 52 Q4 10 52 8 Q56 52 8 52Z" fill="#5BB54A"/>
    <path d="M10 50 L46 14" stroke="#3E8E2F" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

// Bó 10 lá (dùng khi đếm số lớn: mỗi bó là 10).
export function boLa() {
  const la1 = '<path d="M30 56 Q10 32 30 4 Q50 32 30 56Z" fill="#5BB54A" stroke="#3E8E2F" stroke-width="2"/><path d="M30 52 L30 10" stroke="#3E8E2F" stroke-width="2.5" stroke-linecap="round"/>';
  return `<svg viewBox="0 0 60 60" aria-hidden="true">
    <g transform="rotate(-30 30 56)">${la1}</g>
    <g transform="rotate(30 30 56)">${la1}</g>
    <g transform="rotate(-12 30 56)">${la1}</g>
    <g transform="rotate(12 30 56)">${la1}</g>
    <g>${la1}</g>
    <rect x="21" y="40" width="18" height="8" rx="3" fill="#E8443A"/>
    <circle cx="47" cy="13" r="12" fill="#fff" stroke="#E8443A" stroke-width="2.5"/>
    <text x="47" y="18" text-anchor="middle" font-family="'Baloo 2', 'Nunito', sans-serif" font-weight="800" font-size="14" fill="${INK}">10</text>
  </svg>`;
}

// Mồi nhử: khúc xương (khủng long cổ dài chỉ ăn lá).
export function xuong() {
  return `<svg viewBox="0 0 60 60" aria-hidden="true">
    <g transform="rotate(-35 30 30)">
      <rect x="14" y="25" width="32" height="10" rx="5" fill="#FFF8EC" stroke="#C9B48E" stroke-width="2.5"/>
      <circle cx="13" cy="24" r="7" fill="#FFF8EC" stroke="#C9B48E" stroke-width="2.5"/>
      <circle cx="13" cy="36" r="7" fill="#FFF8EC" stroke="#C9B48E" stroke-width="2.5"/>
      <circle cx="47" cy="24" r="7" fill="#FFF8EC" stroke="#C9B48E" stroke-width="2.5"/>
      <circle cx="47" cy="36" r="7" fill="#FFF8EC" stroke="#C9B48E" stroke-width="2.5"/>
      <rect x="14" y="26.5" width="32" height="7" fill="#FFF8EC"/>
    </g>
  </svg>`;
}

const MAU_TRUNG = [
  { nen: '#FFF8EC', vien: '#E2CFAE', dom: '#F2E2C4' },
  { nen: '#FFE1EC', vien: '#E8BCCB', dom: '#F7C6D6' },
  { nen: '#E2F3FF', vien: '#B9D6EA', dom: '#CBE5F6' },
  { nen: '#EEE8FF', vien: '#CBBEF0', dom: '#DCD2FA' },
];

export function trung(so, mauIndex = 0) {
  const m = MAU_TRUNG[mauIndex % MAU_TRUNG.length];
  return `<svg viewBox="0 0 170 210" aria-hidden="true">
    <path class="vo-trung" d="M85 6 C 140 6 164 110 164 140 C 164 182 128 206 85 206 C 42 206 6 182 6 140 C 6 110 30 6 85 6Z" fill="${m.nen}" stroke="${m.vien}" stroke-width="6"/>
    <circle cx="50" cy="72" r="8" fill="${m.dom}"/><circle cx="124" cy="158" r="10" fill="${m.dom}"/>
    <text x="85" y="${String(so).length > 1 ? 152 : 160}" text-anchor="middle" font-family="'Baloo 2', 'Nunito', sans-serif" font-weight="800" font-size="${String(so).length > 1 ? 92 : 118}" fill="${INK}">${so}</text>
  </svg>`;
}

const SAO_PATH = 'M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z';

export function sao(co = true, vien = '#E0A000') {
  return co
    ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${SAO_PATH}" fill="#FFC21A" stroke="${vien}" stroke-width="1.2" stroke-linejoin="round"/></svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${SAO_PATH}" fill="#FFFFFF" stroke="#C9B27A" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
}
export const SAO_D = SAO_PATH;

export function daNangLuong(sang = false) {
  return sang
    ? '<svg viewBox="0 0 22 26" aria-hidden="true"><path d="M11 1 L21 8 L17 25 L5 25 L1 8Z" fill="#9B86FF" stroke="#6A58C9" stroke-width="2" stroke-linejoin="round"/></svg>'
    : '<svg viewBox="0 0 22 26" aria-hidden="true"><path d="M11 1 L21 8 L17 25 L5 25 L1 8Z" fill="#E4E8EF" stroke="#B5BDCB" stroke-width="2" stroke-linejoin="round"/></svg>';
}

export function ruong() {
  return `<svg viewBox="0 0 52 46" aria-hidden="true">
    <path d="M4 18 Q4 4 26 4 Q48 4 48 18Z" fill="#E8443A"/>
    <rect x="4" y="18" width="44" height="24" rx="4" fill="#C9361F"/>
    <rect x="4" y="18" width="44" height="5" fill="#FFC21A"/>
    <rect x="22" y="14" width="8" height="14" rx="2" fill="#FFC21A"/>
  </svg>`;
}

const ICON = {
  nha: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  loa: '<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>',
  tich: '<path d="M4 12.5l5 5L20 6.5"/>',
  choiLai: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>',
  nhac: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  nhacTat: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/><path d="M3 3l18 18"/>',
  album: '<path d="M2 5c3-1.5 7-1.5 10 1 3-2.5 7-2.5 10-1v14c-3-1.5-7-1.5-10 1-3-2.5-7-2.5-10-1z"/><path d="M12 6v14"/>',
  tuDo: '<path d="M8 3l-5 4 3 4 2-1.5V21h8V9.5l2 1.5 3-4-5-4c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3z"/>',
  trai: '<path d="M15 5l-7 7 7 7"/>',
  phai: '<path d="M9 5l7 7-7 7"/>',
  muiTen: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  mayAnh: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  khoa: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
};

export function icon(ten) {
  if (ten === 'choi') {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  }
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[ten]}</svg>`;
}

/** Logo game: Ted mặc áo lá xanh, đội mũ mầm cây có hoa hướng dương, hai tay giơ lá (vẽ theo ảnh của bé). */
export function logoTed() {
  const canhTrang = Array.from({ length: 8 }, (_, i) => `<path d="M150 52 L141 18 L150 6 L159 18Z" fill="#FFFFFF" stroke="#DDE3EA" stroke-width="1.5" transform="rotate(${i * 45} 150 52)"/>`).join('');
  const canhVang = Array.from({ length: 10 }, (_, i) => `<path d="M150 52 L144 30 L150 24 L156 30Z" fill="#FFC21A" stroke="#E0A000" stroke-width="1" transform="rotate(${i * 36 + 18} 150 52)"/>`).join('');
  return `<svg viewBox="0 0 300 320" role="img" aria-label="Logo Ted và Đội Siêu Khủng Long">
    <defs><clipPath id="logo-cat"><circle cx="150" cy="178" r="136"/></clipPath></defs>
    <circle cx="150" cy="178" r="142" fill="#FF7A30"/>
    <circle cx="150" cy="178" r="136" fill="#CDEFFF"/>
    <g clip-path="url(#logo-cat)">
      <ellipse cx="150" cy="330" rx="190" ry="90" fill="#9ADB6E"/>
      <circle cx="58" cy="84" r="20" fill="#FFFFFF" opacity="0.8"/><circle cx="80" cy="80" r="14" fill="#FFFFFF" opacity="0.8"/>
      <path d="M80 330 L92 248 Q150 226 208 248 L220 330Z" fill="#4CB050"/>
      <path d="M118 262 q8 -10 16 0 q-8 6 -16 0Z M170 280 q8 -10 16 0 q-8 6 -16 0Z M140 300 q8 -10 16 0 q-8 6 -16 0Z" fill="#8FE06A"/>
      <path d="M100 254 L66 148" stroke="#4CB050" stroke-width="26" stroke-linecap="round"/>
      <path d="M200 254 L234 148" stroke="#4CB050" stroke-width="26" stroke-linecap="round"/>
    </g>
    <circle cx="96" cy="200" r="11" fill="#F5C9A0"/><circle cx="204" cy="200" r="11" fill="#F5C9A0"/>
    <circle cx="150" cy="196" r="56" fill="#F5C9A0"/>
    <path d="M96 178 Q100 140 150 140 Q200 140 204 178 Q186 162 168 168 Q150 156 132 168 Q114 162 96 178Z" fill="#2B2420"/>
    <path d="M92 168 Q94 122 150 120 Q206 122 208 168 Q150 150 92 168Z" fill="#6CCB5A" stroke="#3E8E2F" stroke-width="3"/>
    <g fill="#FFFFFF" opacity="0.8"><circle cx="112" cy="150" r="2.5"/><circle cx="130" cy="140" r="2.5"/><circle cx="150" cy="137" r="2.5"/><circle cx="170" cy="140" r="2.5"/><circle cx="188" cy="150" r="2.5"/></g>
    <rect x="146" y="60" width="8" height="64" rx="4" fill="#5BB54A"/>
    <path d="M150 118 Q100 92 48 132 Q102 146 150 124Z" fill="#8FE06A" stroke="#3E8E2F" stroke-width="3" stroke-linejoin="round"/>
    <path d="M150 118 Q200 92 252 132 Q198 146 150 124Z" fill="#8FE06A" stroke="#3E8E2F" stroke-width="3" stroke-linejoin="round"/>
    <path d="M146 120 Q100 108 60 130 M154 120 Q200 108 240 130" stroke="#5BB54A" stroke-width="2" fill="none"/>
    <circle cx="60" cy="136" r="14" fill="#F5C9A0"/>
    <circle cx="240" cy="136" r="14" fill="#F5C9A0"/>
    ${canhTrang}${canhVang}
    <circle cx="150" cy="52" r="13" fill="#7A4A2A"/>
    <path d="M118 196 Q128 186 138 196" stroke="#2B2420" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M162 196 Q172 186 182 196" stroke="#2B2420" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="114" cy="214" r="9" fill="#F49A9A" opacity="0.6"/><circle cx="186" cy="214" r="9" fill="#F49A9A" opacity="0.6"/>
    <path d="M124 214 Q150 250 176 214Z" fill="#8E2F3A"/>
    <path d="M126 215 Q150 222 174 215 L172 222 Q150 228 128 222Z" fill="#FFFFFF"/>
  </svg>`;
}

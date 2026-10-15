// Hình vẽ cho Vùng 2 · Thành Phố Xe.

const INK = '#24324A';
export const MAU_XE = ['#E8443A', '#3B82F6', '#FFC21A', '#4CB050', '#A78BFA', '#FF7A30'];

/** Ô tô con nhìn ngang (bãi đỗ). */
export function oTo(mau = '#E8443A') {
  return `<svg viewBox="0 0 100 64" aria-hidden="true">
    <rect x="4" y="26" width="92" height="24" rx="12" fill="${mau}" stroke="${INK}" stroke-width="3"/>
    <path d="M26 28 Q30 8 50 6 Q68 6 74 28Z" fill="#BFE6FF" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="26" cy="52" r="10" fill="${INK}"/><circle cx="74" cy="52" r="10" fill="${INK}"/>
    <circle cx="26" cy="52" r="4" fill="#C8D0DC"/><circle cx="74" cy="52" r="4" fill="#C8D0DC"/>
  </svg>`;
}

/** Xe đua; so (tuỳ chọn) vẽ trên thân xe. */
export function xeDua(so, mau = '#E8443A') {
  return `<svg viewBox="0 0 160 90" aria-hidden="true">
    <rect x="132" y="28" width="22" height="8" rx="3" fill="${INK}"/><rect x="140" y="30" width="6" height="22" fill="${INK}"/>
    <path d="M8 62 Q10 46 40 42 L70 26 Q100 22 120 40 L150 46 Q158 56 154 64 L8 64Z" fill="${mau}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M72 30 Q96 26 112 40 L68 40Z" fill="#BFE6FF" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
    ${so == null ? '' : `<circle cx="82" cy="48" r="17" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5"/>
    <text x="82" y="56" text-anchor="middle" font-family="'Baloo 2', 'Nunito', sans-serif" font-weight="800" font-size="22" fill="${INK}">${so}</text>`}
    <circle cx="40" cy="66" r="14" fill="${INK}"/><circle cx="40" cy="66" r="5" fill="#C8D0DC"/>
    <circle cx="124" cy="66" r="14" fill="${INK}"/><circle cx="124" cy="66" r="5" fill="#C8D0DC"/>
  </svg>`;
}

/** Xe tải chở thùng: thùng cam ghi 10 (hàng chục) và thùng vàng (hàng đơn vị). */
export function xeTaiHang(so, mau = '#3B82F6') {
  const chuc = Math.floor(so / 10);
  const donVi = so % 10;
  const thung = [];
  // Thùng chục: mỗi thùng rộng 15, xếp tối đa 9 thùng trên sàn xe.
  for (let i = 0; i < chuc; i++) {
    const x = 6 + i * 15.5;
    thung.push(`<rect x="${x}" y="40" width="14" height="38" rx="3" fill="#FF7A30" stroke="${INK}" stroke-width="1.6"/><text x="${x + 7}" y="63" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="8" fill="#fff">10</text>`);
  }
  // Thùng lẻ: lưới 3 hàng, đặt ngay sau thùng chục.
  const x0 = 6 + chuc * 15.5 + 2;
  for (let j = 0; j < donVi; j++) {
    const c = Math.floor(j / 3);
    const r = j % 3;
    thung.push(`<rect x="${x0 + c * 12}" y="${66 - r * 12}" width="11" height="11" rx="2" fill="#FFC21A" stroke="${INK}" stroke-width="1.4"/>`);
  }
  const doDaiSan = Math.max(150, x0 + Math.ceil(donVi / 3) * 12 + 6);
  const cabin = doDaiSan;
  return `<svg viewBox="0 0 ${cabin + 52} 110" aria-hidden="true">
    <path d="M${cabin + 2} 88 V54 Q${cabin + 2} 44 ${cabin + 12} 44 L${cabin + 30} 44 Q${cabin + 40} 44 ${cabin + 44} 56 L${cabin + 48} 70 V88Z" fill="${mau}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M${cabin + 14} 50 H${cabin + 30} L${cabin + 36} 66 H${cabin + 14}Z" fill="#BFE6FF"/>
    <rect x="2" y="78" width="${cabin}" height="10" rx="3" fill="#8A94A6" stroke="${INK}" stroke-width="2.5"/>
    ${thung.join('')}
    <circle cx="30" cy="96" r="12" fill="${INK}"/><circle cx="30" cy="96" r="4.5" fill="#C8D0DC"/>
    <circle cx="${cabin - 30}" cy="96" r="12" fill="${INK}"/><circle cx="${cabin - 30}" cy="96" r="4.5" fill="#C8D0DC"/>
    <circle cx="${cabin + 28}" cy="96" r="12" fill="${INK}"/><circle cx="${cabin + 28}" cy="96" r="4.5" fill="#C8D0DC"/>
  </svg>`;
}

export function khoHang() {
  return `<svg viewBox="0 0 110 150" aria-hidden="true">
    <path d="M6 56 L55 12 L104 56Z" fill="#E8443A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <rect x="14" y="56" width="82" height="88" fill="#FFF4D6" stroke="${INK}" stroke-width="3"/>
    <rect x="32" y="90" width="46" height="54" fill="#B98446" stroke="${INK}" stroke-width="3"/>
    <path d="M32 104 H78 M32 118 H78 M32 132 H78" stroke="#8A5A33" stroke-width="2"/>
  </svg>`;
}

export function denGiaoThong() {
  return `<svg viewBox="0 0 40 90" aria-hidden="true">
    <rect x="17" y="50" width="6" height="40" fill="#5C6577"/>
    <rect x="6" y="2" width="28" height="54" rx="8" fill="${INK}"/>
    <circle cx="20" cy="14" r="6" fill="#E8443A"/><circle cx="20" cy="29" r="6" fill="#FFC21A"/><circle cx="20" cy="44" r="6" fill="#4CB050"/>
  </svg>`;
}

export function coDich() {
  return `<svg viewBox="0 0 44 80" aria-hidden="true">
    <rect x="2" y="0" width="5" height="80" fill="${INK}"/>
    <g><rect x="7" y="2" width="12" height="12" fill="${INK}"/><rect x="19" y="2" width="12" height="12" fill="#fff"/><rect x="31" y="2" width="12" height="12" fill="${INK}"/>
    <rect x="7" y="14" width="12" height="12" fill="#fff"/><rect x="19" y="14" width="12" height="12" fill="${INK}"/><rect x="31" y="14" width="12" height="12" fill="#fff"/>
    <rect x="7" y="26" width="12" height="12" fill="${INK}"/><rect x="19" y="26" width="12" height="12" fill="#fff"/><rect x="31" y="26" width="12" height="12" fill="${INK}"/></g>
  </svg>`;
}

// Khung cảnh thành phố dùng chung cho các màn Vùng 2 (vẽ bằng CSS trong style.css).
export const CANH_THANH_PHO = `
  <div class="canh canh-thanh-pho" aria-hidden="true">
    <div class="mat-troi"></div>
    <div class="may may-1"></div>
    <div class="nha nha-1"></div><div class="nha nha-2"></div><div class="nha nha-3"></div>
    <div class="nha nha-4"></div><div class="nha nha-5"></div><div class="nha nha-6"></div>
    <div class="via-he"></div>
  </div>`;

/**
 * Dấu so sánh vẽ thành miệng khủng long: miệng luôn há về phía số lớn hơn.
 * dau: '<' | '>' | '=' | '?'
 */
export function dauSoSanh(dau) {
  const XANH = '#4CB050';
  if (dau === '=') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <rect x="16" y="28" width="68" height="16" rx="8" fill="${XANH}" stroke="${INK}" stroke-width="4"/>
      <rect x="16" y="56" width="68" height="16" rx="8" fill="${XANH}" stroke="${INK}" stroke-width="4"/>
    </svg>`;
  }
  if (dau === '?') {
    return `<svg viewBox="0 0 100 100" aria-hidden="true">
      <text x="50" y="72" text-anchor="middle" font-family="Baloo 2, Nunito, sans-serif" font-weight="800" font-size="70" fill="#FFFFFF">?</text>
    </svg>`;
  }
  // Vẽ dấu '<' (miệng há sang phải); dấu '>' lật ngang.
  const lat = dau === '>' ? ' transform="translate(100 0) scale(-1 1)"' : '';
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><g${lat}>
    <path d="M86 10 L14 46 Q8 50 14 54 L86 90 L92 76 L36 50 L92 24Z" fill="${XANH}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M44 41 L50 32 L54 38 L62 26 L64 33 L74 22 L75 29 M44 59 L50 68 L54 62 L62 74 L64 67 L74 78 L75 71" fill="#FFFFFF" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="30" cy="38" r="6" fill="#FFFFFF" stroke="${INK}" stroke-width="2.5"/><circle cx="31" cy="38" r="2.8" fill="${INK}"/>
  </g></svg>`;
}

/**
 * Bãi xe nhìn từ trên: mỗi chục là một hàng dọc 10 xe có khung, xe lẻ xếp thành cột riêng.
 * Số xe vẽ đúng bằng so, để Ted so được bằng mắt (giống que tính chục và đơn vị).
 */
export function baiXeDem(so, mau = '#E8443A') {
  const chuc = Math.floor(so / 10);
  const le = so % 10;
  const O = 11; // bước mỗi ô xe
  const xe = (x, y) => `<g transform="translate(${x} ${y})"><rect width="9" height="9.4" rx="2.6" fill="${mau}" stroke="${INK}" stroke-width="0.9"/><rect x="1.8" y="1.6" width="5.4" height="2.6" rx="1" fill="#BFE6FF"/></g>`;
  let s = '';
  for (let c = 0; c < chuc; c++) {
    const x = c * 15;
    s += `<rect x="${x - 1.5}" y="-1.5" width="12" height="${10 * O + 1.4}" rx="3.5" fill="none" stroke="#FFFFFF" stroke-width="1.4"/>`;
    for (let i = 0; i < 10; i++) s += xe(x, i * O);
  }
  const xLe = chuc * 15 + (chuc ? 5 : 0);
  for (let i = 0; i < le; i++) s += xe(xLe, (10 - le + i) * O);
  const rong = xLe + (le ? 10 : -4.5) + 2;
  return `<svg class="bai-xe-dem" viewBox="-2 -2 ${Math.max(rong, 12) + 2} ${10 * O + 3}" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${s}</svg>`;
}

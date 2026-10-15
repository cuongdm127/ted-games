import { storage } from './storage.js';
import { xeTed, rex, SAO_D } from './art.js';

// Toạ độ trong hệ 1180 x 820 của bản thiết kế. Bản đồ co giãn theo màn hình.
const TRAM = [
  [120, 690], [330, 600], [560, 660], [760, 560], [620, 420], [420, 330], [700, 200],
];
// Mỗi đoạn đường nối trạm i với trạm i+1 (đường cong bậc hai).
const DOAN = ['Q220 600 330 600', 'Q450 600 560 660', 'Q690 720 760 560', 'Q800 460 620 420', 'Q480 400 420 330', 'Q400 230 700 200'];
const R_TRAM = 56;
const R_CUOI = 68;

function duongDi(soDoan) {
  return `M${TRAM[0][0]} ${TRAM[0][1]} ` + DOAN.slice(0, soDoan).join(' ');
}

function veSao(cx, cy, soSao) {
  let s = '';
  for (let i = 0; i < 3; i++) {
    const x = cx + (i - 1) * 34 - 15;
    const co = i < soSao;
    s += `<path transform="translate(${x} ${cy - 15 - (i === 1 ? 6 : 0)}) scale(1.25)" d="${SAO_D}"
      fill="${co ? '#FFC21A' : '#FFFFFF'}" stroke="${co ? '#E0A000' : '#C9B27A'}" stroke-width="1.3" stroke-linejoin="round"/>`;
  }
  return s;
}

const DAO = 'M60 760 C 20 600 80 420 200 330 C 300 250 300 140 460 120 C 620 100 760 110 840 170 C 900 230 880 330 860 420 C 840 560 900 700 800 770 C 600 820 200 820 60 760Z';
const DAO_BEN = 'M940 380 C 1000 300 1140 320 1170 420 C 1200 540 1120 640 1020 620 C 930 600 900 470 940 380Z';

// Mỗi vùng một chủ đề: màu đảo, màu đường, đồ trang trí.
const CHU_DE = {
  1: {
    co: '#A6DE7A',
    duongVien: '#E9C77F',
    duong: '#FFF3D1',
    vachGiua: null,
    trangTri: `
  <g class="cay">
    <rect x="226" y="470" width="8" height="22" rx="3" fill="#8A5A33"/><circle cx="230" cy="462" r="22" fill="#5BB54A"/>
    <rect x="268" y="505" width="8" height="22" rx="3" fill="#8A5A33"/><circle cx="272" cy="497" r="18" fill="#4FA640"/>
    <rect x="482" y="250" width="8" height="22" rx="3" fill="#8A5A33"/><circle cx="486" cy="242" r="22" fill="#5BB54A"/>
    <rect x="656" y="520" width="8" height="22" rx="3" fill="#8A5A33"/><circle cx="660" cy="512" r="20" fill="#4FA640"/>
    <rect x="160" y="740" width="8" height="18" rx="3" fill="#8A5A33"/><circle cx="164" cy="734" r="16" fill="#5BB54A"/>
  </g>
  <g>
    <ellipse cx="440" cy="548" rx="44" ry="14" fill="#C99A5B"/>
    <ellipse cx="420" cy="534" rx="13" ry="17" fill="#FFF8EC" stroke="#E2CFAE" stroke-width="2"/>
    <ellipse cx="442" cy="530" rx="13" ry="17" fill="#FFE1EC" stroke="#E8BCCB" stroke-width="2"/>
    <ellipse cx="462" cy="536" rx="13" ry="17" fill="#E2F3FF" stroke="#B9D6EA" stroke-width="2"/>
  </g>`,
  },
  2: {
    co: '#BFE3A0',
    duongVien: '#3E4656',
    duong: '#5C6577',
    vachGiua: '#FFFFFF',
    trangTri: `
  <g>
    <rect x="196" y="420" width="44" height="74" rx="6" fill="#BEE3F8" stroke="#24324A" stroke-width="2.5"/>
    <rect x="246" y="446" width="40" height="48" rx="6" fill="#FFC9D6" stroke="#24324A" stroke-width="2.5"/>
    <rect x="460" y="196" width="50" height="76" rx="6" fill="#FFD9A8" stroke="#24324A" stroke-width="2.5"/>
    <rect x="640" y="480" width="44" height="58" rx="6" fill="#C7F0B5" stroke="#24324A" stroke-width="2.5"/>
    <g fill="#FFFFFF"><rect x="206" y="432" width="9" height="9"/><rect x="222" y="432" width="9" height="9"/><rect x="206" y="450" width="9" height="9"/><rect x="222" y="450" width="9" height="9"/><rect x="472" y="210" width="10" height="10"/><rect x="490" y="210" width="10" height="10"/><rect x="472" y="230" width="10" height="10"/><rect x="490" y="230" width="10" height="10"/><rect x="652" y="494" width="8" height="8"/><rect x="666" y="494" width="8" height="8"/></g>
  </g>
  <g>
    <rect x="392" y="510" width="96" height="56" rx="8" fill="#8A94A6" stroke="#24324A" stroke-width="2.5"/>
    <path d="M424 512 V564 M456 512 V564" stroke="#fff" stroke-width="3"/>
    <rect x="400" y="528" width="20" height="12" rx="4" fill="#E8443A"/><rect x="464" y="530" width="20" height="12" rx="4" fill="#3B82F6"/>
  </g>
  <g transform="translate(222 700)"><rect x="7" y="20" width="4" height="28" fill="#5C6577"/><rect x="0" y="0" width="18" height="34" rx="5" fill="#24324A"/><circle cx="9" cy="8" r="4" fill="#E8443A"/><circle cx="9" cy="17" r="4" fill="#FFC21A"/><circle cx="9" cy="26" r="4" fill="#4CB050"/></g>`,
  },
};
const TEN_VUNG = { 1: 'Bãi Trứng Khủng Long', 2: 'Thành Phố Xe', 3: 'Vùng 3', 4: 'Vùng 4', 5: 'Vùng 5' };
export function tenVung(vung) {
  return TEN_VUNG[vung] || `Vùng ${vung}`;
}

const DEN_LONG = [[225, 560], [450, 566], [700, 690], [790, 470], [500, 370], [470, 230]];

/**
 * Vẽ bản đồ một vùng.
 * tuyChon: { vung, soMan, onChonMan, doMac, sangDen (màn ăn mừng: đèn sáng, không bấm được),
 *            vungSauDaMo, coVungSau, onDoiVung }
 */
export function renderBanDo(container, tuyChon) {
  const { vung = 1, soMan = 7, onChonMan, doMac, sangDen = false, vungSauDaMo = false, coVungSau = true, onDoiVung } = tuyChon;
  const cd = CHU_DE[vung] || CHU_DE[1];
  const data = storage.docTienDo();
  const soTram = Math.min(soMan, TRAM.length);

  let tramHienTai = soTram;
  for (let man = 1; man <= soTram; man++) {
    if (storage.manDaMo(vung, man, data) && storage.saoCuaMan(vung, man, data) === 0) {
      tramHienTai = man;
      break;
    }
  }

  let tram = '';
  for (let man = 1; man <= soTram; man++) {
    const [x, y] = TRAM[man - 1];
    const moRoi = storage.manDaMo(vung, man, data);
    const soSao = storage.saoCuaMan(vung, man, data);
    const laCuoi = man === soTram;
    const r = laCuoi ? R_CUOI : R_TRAM;
    const dangChoi = man === tramHienTai && moRoi && soSao === 0;

    if (!moRoi) {
      tram += `<g class="tram khoa" aria-label="Màn ${man}, chưa mở">
        <circle cx="${x}" cy="${y}" r="${r}" fill="${laCuoi ? '#8E84C4' : '#D3DAE4'}" stroke="#fff" stroke-width="7"/>
        ${laCuoi
          ? `<path transform="translate(${x - 26} ${y - 31}) scale(2.4)" d="M11 1 L21 8 L17 25 L5 25 L1 8Z" fill="#C9C0F0" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>`
          : `<g transform="translate(${x - 21} ${y - 21}) scale(1.75)" stroke="#7D899E" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g>`}
      </g>`;
      continue;
    }

    const nen = dangChoi ? '#FF7A30' : laCuoi ? '#6A58C9' : '#FFFFFF';
    const vien = dangChoi ? '#FFFFFF' : laCuoi ? '#FFFFFF' : '#4CB050';
    const bong = dangChoi ? '#C9561C' : laCuoi ? '#4A3D93' : '#3A8F3E';
    const chu = dangChoi || laCuoi ? '#FFFFFF' : '#24324A';
    const nhan = laCuoi
      ? `<path transform="translate(${x - 26} ${y - 31}) scale(2.4)" d="M11 1 L21 8 L17 25 L5 25 L1 8Z" fill="#B9A9FF" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/>`
      : `<text x="${x}" y="${y + 17}" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="50" fill="${chu}">${man}</text>`;

    tram += `<g class="tram mo${dangChoi ? ' dang-choi' : ''}" data-man="${man}" ${sangDen ? '' : 'role="button" tabindex="0"'}
        aria-label="Màn ${man}${soSao ? `, ${soSao} sao` : dangChoi ? ', chơi tiếp' : ''}">
      ${dangChoi ? `<circle class="vong-nhip" cx="${x}" cy="${y}" r="${r + 14}" fill="rgba(255,122,48,0.3)"/>` : ''}
      <circle cx="${x}" cy="${y + 7}" r="${r}" fill="${bong}"/>
      <circle cx="${x}" cy="${y}" r="${r}" fill="${nen}" stroke="${vien}" stroke-width="7"/>
      ${nhan}
      ${soSao > 0 ? veSao(x, y - r - 20, soSao) : ''}
    </g>`;
  }

  const [xc, yc] = TRAM[tramHienTai - 1];
  const daXongHet = storage.saoCuaMan(vung, soTram, data) > 0;

  // Đảo vùng sau ở mép phải.
  const vungSau = vung + 1;
  const daoBen = vungSauDaMo
    ? `<g class="dao-ben mo" data-vung="${vungSau}" ${onDoiVung ? 'role="button" tabindex="0"' : ''} aria-label="Sang ${tenVung(vungSau)}">
        <path d="${DAO_BEN}" fill="${(CHU_DE[vungSau] || CHU_DE[1]).co}" stroke="#FFE3A3" stroke-width="16"/>
        <g transform="translate(990 440)"><rect width="140" height="44" rx="22" fill="#4CB050"/><text x="70" y="30" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="22" fill="#fff">Vùng ${vungSau} ›</text></g>
      </g>`
    : coVungSau
      ? `<path d="${DAO_BEN}" fill="#56627F"/>
        <ellipse cx="1000" cy="400" rx="60" ry="26" fill="#6E7A98"/><ellipse cx="1090" cy="470" rx="70" ry="28" fill="#6E7A98"/><ellipse cx="1030" cy="560" rx="54" ry="22" fill="#6E7A98"/>
        <g transform="translate(1004 430)">
          <rect width="120" height="40" rx="20" fill="rgba(36,50,74,0.75)"/>
          <g transform="translate(14 9) scale(0.92)" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g>
          <text x="74" y="28" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="700" font-size="21" fill="#fff">Vùng ${vungSau}</text>
        </g>`
      : '';

  const denLong = sangDen
    ? `<g class="den-long">${DEN_LONG.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="22" fill="#FFD84A" fill-opacity="0.35"/><circle cx="${x}" cy="${y}" r="9" fill="#FFE68A"/>`).join('')}</g>`
    : '';

  const xe = sangDen ? '' : `<g class="xe-ted" transform="translate(${xc + R_TRAM - 10} ${yc - 34})"><g class="xe-nay">
      ${xeTed(doMac).replace('<svg ', '<svg width="128" height="82" ')}
    </g></g>`;

  container.innerHTML = `
    <div class="ban-do${sangDen ? ' ban-do-dem' : ''}">
      <svg class="ban-do-svg" viewBox="0 90 1180 730" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Bản đồ ${tenVung(vung)}">
        <path d="${DAO}" fill="#FFE3A3" stroke="#FFE3A3" stroke-width="36" stroke-linejoin="round"/>
        <path d="${DAO}" fill="${cd.co}"/>
        ${daoBen}
        <path d="M700 200 Q 860 230 980 430" stroke="${vungSauDaMo || daXongHet ? '#FFC21A' : '#fff'}" stroke-opacity="0.8" stroke-width="6" fill="none" stroke-dasharray="4 14" stroke-linecap="round"/>
        ${cd.trangTri}
        <path d="${duongDi(DOAN.length)}" stroke="${cd.duongVien}" stroke-width="52" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${duongDi(DOAN.length)}" stroke="${cd.duong}" stroke-width="40" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        ${cd.vachGiua ? `<path d="${duongDi(DOAN.length)}" stroke="${cd.vachGiua}" stroke-opacity="0.7" stroke-width="3" fill="none" stroke-dasharray="14 12"/>` : ''}
        ${tramHienTai > 1 || daXongHet ? `<path d="${duongDi(daXongHet ? DOAN.length : tramHienTai - 1)}" stroke="#FFC21A" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="2 16"/>` : ''}
        ${denLong}
        ${tram}
        ${xe}
      </svg>
      ${sangDen ? '' : `<div class="rex-ban-do">
        <p class="bong-ban-do">${daXongHet ? 'Ted đã xong vùng này rồi! Chơi lại để gom thêm sao nhé.' : 'Chạm vào trạm cam để chơi tiếp nhé!'}</p>
        <div class="rex-ban-do-hinh">${rex()}</div>
      </div>`}
    </div>`;

  if (!sangDen) {
    const gan = (el, fn) => {
      el.addEventListener('click', fn);
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fn();
        }
      });
    };
    container.querySelectorAll('.tram.mo').forEach((g) => gan(g, () => onChonMan(Number(g.dataset.man))));
    const ben = container.querySelector('.dao-ben.mo');
    if (ben && onDoiVung) gan(ben, () => onDoiVung(Number(ben.dataset.vung)));
  }

  let tongSaoVung = 0;
  for (let man = 1; man <= soTram; man++) tongSaoVung += storage.saoCuaMan(vung, man, data);
  return { tongSaoVung, daXongHet };
}

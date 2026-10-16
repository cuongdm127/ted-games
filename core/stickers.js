// Sticker nhận được khi xong mỗi màn (mỗi vùng 7 sticker).
import { la, boLa, trung, khungLongCoDai, MAU_KHUNG_LONG } from './art.js';
import { oTo, xeDua, xeTaiHang, khoHang, denGiaoThong, coDich } from './art-vung2.js';

const INK = '#24324A';

const khungLongCon = `<svg viewBox="0 0 112 112" aria-hidden="true">
  <path d="M20 70 L30 56 L40 68 L50 54 L60 68 L72 54 L82 68 L92 58 L92 92 Q56 112 20 92Z" fill="#FFF8EC" stroke="#E2CFAE" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="56" cy="46" rx="26" ry="22" fill="#5CC36A"/>
  <circle cx="64" cy="40" r="6" fill="#fff"/><circle cx="65" cy="41" r="3" fill="${INK}"/>
  <path d="M52 54 Q60 60 70 52" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M34 34 L38 22 L44 32Z" fill="#FF7A30"/>
</svg>`;

const toTrung = `<svg viewBox="0 0 120 80" aria-hidden="true">
  <ellipse cx="60" cy="62" rx="54" ry="16" fill="#C99A5B"/>
  <ellipse cx="38" cy="44" rx="16" ry="21" fill="#FFF8EC" stroke="#E2CFAE" stroke-width="3"/>
  <ellipse cx="62" cy="38" rx="16" ry="21" fill="#FFE1EC" stroke="#E8BCCB" stroke-width="3"/>
  <ellipse cx="84" cy="46" rx="16" ry="21" fill="#E2F3FF" stroke="#B9D6EA" stroke-width="3"/>
</svg>`;

const nuiLua = `<svg viewBox="0 0 120 100" aria-hidden="true">
  <path d="M6 96 L44 30 L54 38 L66 30 L114 96Z" fill="#B9A08A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  <path d="M44 30 Q50 10 58 22 Q62 4 70 18 L66 30 L54 38Z" fill="#FF7A30"/>
  <circle cx="44" cy="12" r="6" fill="#C8D0DC"/><circle cx="74" cy="8" r="8" fill="#C8D0DC"/>
</svg>`;

const da = (mau, vien) => `<svg viewBox="0 0 22 26" aria-hidden="true"><path d="M11 1 L21 8 L17 25 L5 25 L1 8Z" fill="${mau}" stroke="${vien}" stroke-width="1.6" stroke-linejoin="round"/><path d="M1 8 L21 8 M11 1 L7 8 L11 25 L15 8Z" stroke="#fff" stroke-opacity="0.7" stroke-width="0.8" fill="none"/></svg>`;

const DANH_SACH = {
  1: [khungLongCon, boLa(), trung(7, 1), khungLongCoDai(MAU_KHUNG_LONG[3]).replace('class="vong-mieng"', 'class="vong-mieng" display="none"'), toTrung, nuiLua, da('#9B86FF', '#6A58C9')],
  2: [oTo('#E8443A'), xeDua(1, '#3B82F6'), xeTaiHang(23, '#4CB050'), denGiaoThong(), khoHang(), coDich(), da('#9B86FF', '#6A58C9')],
};

export function sticker(vung, man) {
  const ds = DANH_SACH[vung];
  return ds ? ds[(man - 1) % ds.length] : la();
}

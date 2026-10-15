// Điều khiển toàn bộ game: chuyển màn hình, chơi màn, phần thưởng.
import { LEVELS } from '../data/levels.js';
import { renderBanDo, tenVung } from './map.js';
import { storage } from './storage.js';
import { tinhSao } from './rewards.js';
import { noi, noiLai } from './speech.js';
import { khoiTaoAm, phatDung, phatSai } from './audio.js';
import { khoiDongNhac, chonBai, batTatNhac, nhacDangBat } from './music.js';
import { rex, rexMat, tedMat, tedToanThan, xeTed, hinhDo, sao, daNangLuong, ruong, icon, logoTed } from './art.js';
import { docAnh, luuAnhTuFile, xoaAnh } from './anh.js';
import { DO, O_DO, SAO_MOT_RUONG, doTiepTheo, soRuongCho } from './items.js';
import { sticker } from './stickers.js';
import { taoCau as taoCauDem } from '../games/dem.js';
import { taoCau as taoCauTimSo } from '../games/timso.js';
import { taoCau as taoCauSoSanh } from '../games/sosanh.js';
import { taoCau as taoCauChoHang } from '../games/chohang.js';
import { taoCau as taoCauXepXe } from '../games/xepxe.js';

const MODULES = { dem: taoCauDem, timso: taoCauTimSo, sosanh: taoCauSoSanh, chohang: taoCauChoHang, xepxe: taoCauXepXe };
const LOI_KHEN = ['Giỏi quá, Ted ơi!', 'Tuyệt lắm!', 'Ted làm đúng rồi!', 'Hay quá, Ted ơi!'];
const SO_VUNG = 5;

const $ = (id) => document.getElementById(id);
const MAN_HINH = ['mo-dau', 'ban-do', 'choi', 'ket-qua', 'ruong', 'tu-do', 'da', 'album'];
const manHinh = Object.fromEntries(MAN_HINH.map((t) => [t, $(`man-hinh-${t}`)]));
const khungBanDo = $('khung-ban-do');
const khungCau = $('khung-cau');
const rexNoiBong = $('rex-noi-bong');
const matRex = $('mat-rex');
const tienDo = $('tien-do');

const levelsCua = (vung) => LEVELS[`vung${vung}`] || [];
const coVung = (vung) => levelsCua(vung).length > 0;
const doMacHienTai = () => storage.docTienDo().doMac;

// ---------- Hình vẽ tĩnh ----------
$('goi-y-hinh').innerHTML = rex();
$('sao-icon').innerHTML = sao(true);
matRex.innerHTML = rexMat();
document.querySelectorAll('[data-icon]').forEach((el) => {
  el.innerHTML = icon(el.dataset.icon);
});
document.querySelectorAll('#ruong-icon, [data-ruong]').forEach((el) => {
  el.innerHTML = ruong();
});
$('rex-nhay').innerHTML = rex({ cuoiTo: true, nhay: true });
$('rex-ruong').innerHTML = rex({ cuoiTo: true, nhay: true });
$('nut-ruong-ban-do').innerHTML = ruong();

// ---------- Nhạc nền ----------
const nutNhac = document.querySelectorAll('.nut-nhac');
function veNutNhac() {
  const bat = nhacDangBat();
  nutNhac.forEach((n) => {
    n.innerHTML = icon(bat ? 'nhac' : 'nhacTat');
    n.classList.toggle('tat', !bat);
    n.setAttribute('aria-pressed', String(bat));
  });
}
let lanChamDauVaoNutNhac = false;
nutNhac.forEach((n) => n.addEventListener('click', () => {
  if (lanChamDauVaoNutNhac) {
    lanChamDauVaoNutNhac = false;
    khoiDongNhac();
    return;
  }
  batTatNhac();
  veNutNhac();
}));
veNutNhac();

let daCham = false;
document.addEventListener('pointerdown', (e) => {
  daCham = true;
  khoiTaoAm();
  if (!e.target.closest('.nut-nhac')) khoiDongNhac();
  else if (nhacDangBat()) lanChamDauVaoNutNhac = true;
}, { once: true });

// ---------- Trạng thái ----------
let vungDangXem = 1;
let manHienTai = null;
let vungDangChoi = 1;
let cauIndex = 0;
let soLanSaiCau = 0;
let tongSoLanSaiMan = 0;
let controllerHienTai = null;
let henGio = null;
let hangCho = []; // các màn phần thưởng chờ hiện sau khi xong màn

(function chonVungBanDau() {
  const data = storage.docTienDo();
  for (let v = 1; v <= SO_VUNG; v++) if (coVung(v) && storage.vungDaMo(v, data)) vungDangXem = v;
})();

function hienManHinh(ten) {
  clearTimeout(henGio);
  Object.values(manHinh).forEach((m) => m.classList.add('an'));
  manHinh[ten].classList.remove('an');
  chonBai(['mo-dau', 'ban-do', 'tu-do', 'album'].includes(ten) ? 'ban-do' : 'choi');
}

function coRuong() {
  const d = storage.docTienDo();
  return soRuongCho(storage.tongSao(d), d.ruongDaMo, d.doDaCo) > 0;
}

// ---------- Bản đồ ----------
function veBanDo() {
  const data = storage.docTienDo();
  const levels = levelsCua(vungDangXem);
  const vungSauCo = coVung(vungDangXem + 1);
  renderBanDo(khungBanDo, {
    vung: vungDangXem,
    soMan: levels.length,
    onChonMan: (man) => batDauMan(vungDangXem, man),
    doMac: data.doMac,
    vungSauDaMo: vungSauCo && storage.vungDaMo(vungDangXem + 1, data),
    coVungSau: vungDangXem < SO_VUNG,
    onDoiVung: (v) => {
      vungDangXem = v;
      veBanDo();
    },
  });

  $('mat-ted').innerHTML = docAnh() ? `<img src="${docAnh()}" alt="">` : tedMat(data.doMac);
  $('ten-vung').textContent = `Vùng ${vungDangXem} · ${tenVung(vungDangXem)}`;
  const tong = storage.tongSao(data);
  $('tong-sao').textContent = String(tong);
  $('chip-sao').setAttribute('aria-label', `${tong} sao`);
  let soDa = 0;
  for (let v = 1; v <= SO_VUNG; v++) if (coVung(v) && storage.saoCuaMan(v, levelsCua(v).length, data) > 0) soDa++;
  $('hang-da').innerHTML = Array.from({ length: SO_VUNG }, (_, i) => daNangLuong(i < soDa)).join('');
  $('hang-da').setAttribute('aria-label', `Đá Năng Lượng: ${soDa} trên ${SO_VUNG}`);

  const nutTruoc = $('nut-vung-truoc');
  const nutSau = $('nut-vung-sau');
  nutTruoc.hidden = vungDangXem <= 1;
  nutSau.hidden = !(vungSauCo && storage.vungDaMo(vungDangXem + 1, data));
  $('nut-ruong-ban-do').hidden = !coRuong();

  hienManHinh('ban-do');
  if (daCham) noi('Chạm vào trạm cam để chơi tiếp nhé!');
}

$('nut-vung-truoc').addEventListener('click', () => {
  vungDangXem = Math.max(1, vungDangXem - 1);
  veBanDo();
});
$('nut-vung-sau').addEventListener('click', () => {
  vungDangXem += 1;
  veBanDo();
});

// ---------- Màn chơi ----------
function rexNoi(text) {
  rexNoiBong.textContent = text;
  noi(text);
}

function rexVui() {
  matRex.classList.remove('nay');
  void matRex.offsetWidth;
  matRex.classList.add('nay');
}

function veTienDo() {
  const tong = manHienTai.cau.length;
  tienDo.setAttribute('aria-label', `Câu ${Math.min(cauIndex + 1, tong)} trên ${tong}`);
  tienDo.innerHTML = manHienTai.cau
    .map((_, i) => `<span class="cham ${i < cauIndex ? 'xong' : i === cauIndex ? 'dang' : ''}"></span>`)
    .join('');
}

function batDauMan(vung, soMan) {
  vungDangChoi = vung;
  manHienTai = levelsCua(vung)[soMan - 1];
  cauIndex = 0;
  tongSoLanSaiMan = 0;
  hangCho = [];
  khungCau.innerHTML = '';
  khungCau.dataset.vung = String(vung);
  hienManHinh('choi');
  veTienDo();
  if (manHienTai.cauChuyen) {
    rexNoi(manHienTai.cauChuyen);
    henGio = setTimeout(batDauCau, 4500);
  } else {
    batDauCau();
  }
}

function batDauCau() {
  veTienDo();
  if (cauIndex >= manHienTai.cau.length) {
    ketThucMan();
    return;
  }
  soLanSaiCau = 0;
  const cauData = manHienTai.cau[cauIndex];
  khungCau.innerHTML = '';
  // 'doc' là câu Rex đọc thành tiếng, 'hoi' là chữ hiện trong bong bóng.
  rexNoiBong.textContent = cauData.hoi;
  noi(cauData.doc || cauData.hoi);
  controllerHienTai = MODULES[cauData.kieu](khungCau, cauData, { onDung: xuLyDung, onSai: xuLySai });
}

function xuLyDung() {
  phatDung();
  rexVui();
  rexNoi(LOI_KHEN[Math.floor(Math.random() * LOI_KHEN.length)]);
  cauIndex++;
  veTienDo();
  henGio = setTimeout(batDauCau, 1500);
}

function xuLySai() {
  soLanSaiCau++;
  tongSoLanSaiMan++;
  phatSai();
  if (soLanSaiCau === 1) {
    rexNoi('Thử lại nhé, Ted ơi!');
  } else if (soLanSaiCau === 2) {
    rexNoi('Nhìn kỹ gợi ý nhé!');
    if (controllerHienTai && controllerHienTai.goiYDapAn) controllerHienTai.goiYDapAn();
  } else {
    rexNoi('Để Rex làm mẫu nhé!');
    if (controllerHienTai && controllerHienTai.lamMau) {
      controllerHienTai.lamMau(() => {
        soLanSaiCau = 0;
      });
    } else {
      soLanSaiCau = 0;
    }
  }
}

function phaoGiay(khung) {
  const mau = ['#FFC21A', '#FF7A30', '#5CC36A', '#8ED8F2', '#B9A9FF'];
  khung.innerHTML = Array.from({ length: 28 }, (_, i) => {
    const trai = Math.random() * 100;
    const tre = Math.random() * 0.8;
    const quay = Math.random() * 360;
    return `<i style="left:${trai}%;background:${mau[i % mau.length]};animation-delay:${tre}s;--quay:${quay}deg"></i>`;
  }).join('');
}

function veThanhRuong(prefix) {
  const d = storage.docTienDo();
  const tong = storage.tongSao(d);
  const day = soRuongCho(tong, d.ruongDaMo, d.doDaCo) > 0;
  const trong = day ? SAO_MOT_RUONG : tong % SAO_MOT_RUONG;
  $(`${prefix}-day`).style.width = `${(trong / SAO_MOT_RUONG) * 100}%`;
  $(`${prefix}-chu`).textContent = `${trong} / ${SAO_MOT_RUONG} sao`;
  $(`${prefix}`).setAttribute('aria-label', day ? 'Có rương quà để mở' : `${trong} trên ${SAO_MOT_RUONG} sao để mở rương quà`);
  $(`${prefix}`).classList.toggle('day', day);
}

function ketThucMan() {
  const soSao = tinhSao(tongSoLanSaiMan);
  const soMan = levelsCua(vungDangChoi).length;
  const laManCuoi = manHienTai.man === soMan;
  storage.luuMan(vungDangChoi, manHienTai.man, soSao);
  const data = storage.docTienDo();

  hangCho = [];
  if (laManCuoi && !data.daDaXem.includes(vungDangChoi)) hangCho.push('da');

  const ketQuaSao = $('ket-qua-sao');
  ketQuaSao.innerHTML = [0, 1, 2]
    .map((i) => `<span class="sao-to sao-${i}${i < soSao ? ' co' : ''}">${sao(i < soSao, '#FFFFFF')}</span>`)
    .join('');
  ketQuaSao.setAttribute('aria-label', `${soSao} trên 3 sao`);
  $('ket-qua-tieu-de').textContent = 'Giỏi quá, Ted ơi!';
  $('ket-qua-sticker').innerHTML = sticker(vungDangChoi, manHienTai.man);
  veThanhRuong('the-ruong');

  phaoGiay($('phao-giay'));
  hienManHinh('ket-qua');
  noi(`Ted được ${soSao} sao và một sticker mới!`);
}

function tiepTheo() {
  const viec = hangCho.shift();
  if (viec === 'da') hienDaNangLuong();
  else if (coRuong()) hienRuong();
  else veBanDo();
}

$('nut-ve-ban-do').addEventListener('click', veBanDo);
$('nut-tiep-tuc').addEventListener('click', tiepTheo);
$('nut-choi-lai').addEventListener('click', () => batDauMan(vungDangChoi, manHienTai.man));
$('nut-loa').addEventListener('click', noiLai);

// ---------- Đá Năng Lượng ----------
let vungVuaXong = 1;
function hienDaNangLuong() {
  vungVuaXong = vungDangChoi;
  storage.danhDauDaXem(vungVuaXong);
  const data = storage.docTienDo();
  const coSau = coVung(vungVuaXong + 1);
  renderBanDo($('khung-da'), {
    vung: vungVuaXong, soMan: levelsCua(vungVuaXong).length, sangDen: true,
    vungSauDaMo: coSau, coVungSau: vungVuaXong < SO_VUNG, doMac: data.doMac,
  });
  let soDa = 0;
  for (let v = 1; v <= SO_VUNG; v++) if (coVung(v) && storage.saoCuaMan(v, levelsCua(v).length, data) > 0) soDa++;
  $('da-hang').innerHTML = Array.from({ length: SO_VUNG }, (_, i) => daNangLuong(i < soDa)).join('');
  $('da-hang').setAttribute('aria-label', `Đá Năng Lượng: ${soDa} trên ${SO_VUNG}`);
  $('da-tieu-de').textContent = `Vùng ${vungVuaXong} sáng đèn rồi!`;
  $('da-nut-chu').textContent = coSau ? `Đến Vùng ${vungVuaXong + 1}` : 'Về bản đồ';
  phaoGiay($('phao-giay-da'));
  hienManHinh('da');
  noi(coSau
    ? `Ted tìm được Đá Năng Lượng! Vùng ${vungVuaXong} sáng đèn rồi. Vùng ${vungVuaXong + 1} đã mở!`
    : `Ted tìm được Đá Năng Lượng! Vùng ${vungVuaXong} sáng đèn rồi!`);
}
$('nut-da-tiep').addEventListener('click', () => {
  if (coVung(vungVuaXong + 1)) vungDangXem = vungVuaXong + 1;
  tiepTheo();
});

// ---------- Rương quà ----------
let doVuaNhan = null;
function hienRuong() {
  const d = storage.docTienDo();
  doVuaNhan = doTiepTheo(d.doDaCo);
  if (!doVuaNhan) {
    veBanDo();
    return;
  }
  const m = manHinh.ruong;
  m.classList.remove('da-mo');
  $('ruong-mon').innerHTML = hinhDo(doVuaNhan);
  $('ruong-tieu-de').textContent = 'Chạm vào rương nào!';
  hienManHinh('ruong');
  noi('Ted có rương quà! Chạm vào để mở nhé!');
}

function moRuong() {
  const m = manHinh.ruong;
  if (m.classList.contains('da-mo') || !doVuaNhan) return;
  storage.moRuong(doVuaNhan);
  m.classList.add('da-mo');
  phatDung();
  $('ruong-tieu-de').textContent = `${DO[doVuaNhan].ten}!`;
  noi(`Ted được ${DO[doVuaNhan].ten}!`);
}
$('hinh-ruong').addEventListener('click', moRuong);
$('nut-mac-thu').addEventListener('click', () => {
  if (!manHinh.ruong.classList.contains('da-mo')) moRuong();
  storage.mac(DO[doVuaNhan].o, doVuaNhan);
  hienTuDo(O_DO[DO[doVuaNhan].o].tab, true);
});
$('nut-ruong-tiep').addEventListener('click', () => {
  if (!manHinh.ruong.classList.contains('da-mo')) moRuong();
  tiepTheo();
});
$('nut-ruong-ban-do').addEventListener('click', hienRuong);

// ---------- Tủ đồ ----------
const DO_THEO_TAB = {
  ted: ['ao-do', 'ao-lua', 'ao-xanh', 'mat-na-xanh', 'mat-na-vang', 'khien-sao', 'mu-phi-cong', 'giay-ten-lua'],
  xe: ['son-do', 'son-xanh', 'banh-lua', 'canh-bay', 'den-sieu-sang'],
};
let tabTuDo = 'ted';
let tuDoTuRuong = false;

function veTuDo() {
  const d = storage.docTienDo();
  document.querySelectorAll('.tab-tu-do').forEach((t) => {
    const chon = t.dataset.tab === tabTuDo;
    t.classList.toggle('chon', chon);
    t.setAttribute('aria-selected', String(chon));
  });
  $('tab-ted-mat').innerHTML = tedMat(d.doMac);
  $('tab-xe-hinh').innerHTML = xeTed(d.doMac);
  $('xem-truoc').innerHTML = tabTuDo === 'ted' ? tedToanThan(d.doMac) : xeTed(d.doMac);
  $('xem-truoc').className = `xem-truoc xem-${tabTuDo}`;
  $('luoi-do').innerHTML = DO_THEO_TAB[tabTuDo].map((id) => {
    const co = d.doDaCo.includes(id);
    const dangMac = d.doMac[DO[id].o] === id;
    return `<button class="o-do${co ? '' : ' khoa'}${dangMac ? ' dang-mac' : ''}" data-id="${id}"
      aria-label="${DO[id].ten}${dangMac ? ', đang dùng' : co ? '' : ', chưa có'}" aria-pressed="${dangMac}">
      <span class="o-do-hinh">${hinhDo(id, !co)}</span>
      ${dangMac ? `<span class="o-do-tich">${icon('tich')}</span>` : ''}
      ${co ? '' : `<span class="o-do-ruong">${ruong()}</span>`}
    </button>`;
  }).join('');
  $('luoi-do').querySelectorAll('.o-do').forEach((b) => b.addEventListener('click', () => chonDo(b)));
  veThanhRuong('tu-do-ruong');
  $('nut-tu-do-ruong').hidden = !coRuong();
}

function chonDo(nut) {
  const id = nut.dataset.id;
  const d = storage.docTienDo();
  if (!d.doDaCo.includes(id)) {
    nut.classList.remove('lac');
    void nut.offsetWidth;
    nut.classList.add('lac');
    noi('Gom thêm sao để mở rương nhé!');
    return;
  }
  const o = DO[id].o;
  storage.mac(o, d.doMac[o] === id && O_DO[o].boDuoc ? null : id);
  phatDung();
  veTuDo();
}

function hienTuDo(tab = 'ted', tuRuong = false) {
  tabTuDo = tab;
  tuDoTuRuong = tuRuong;
  veTuDo();
  hienManHinh('tu-do');
}
document.querySelectorAll('.tab-tu-do').forEach((t) => t.addEventListener('click', () => {
  tabTuDo = t.dataset.tab;
  veTuDo();
}));
$('nut-tu-do').addEventListener('click', () => hienTuDo('ted'));
$('nut-tu-do-ve').addEventListener('click', () => (tuDoTuRuong ? tiepTheo() : veBanDo()));
$('nut-tu-do-ruong').addEventListener('click', hienRuong);

// ---------- Album sticker ----------
let vungAlbum = 1;
const VI_TRI_STICKER = [[4, 50], [28, 64], [52, 62], [14, 14], [44, 24], [72, 10], [76, 62]];

function veAlbum() {
  const d = storage.docTienDo();
  $('tab-album').innerHTML = Array.from({ length: SO_VUNG }, (_, i) => {
    const v = i + 1;
    const mo = coVung(v) && storage.vungDaMo(v, d);
    return `<button class="tab-vung${v === vungAlbum ? ' chon' : ''}${mo ? '' : ' khoa'}" data-vung="${v}" role="tab"
      aria-selected="${v === vungAlbum}" aria-label="Vùng ${v}${mo ? '' : ', chưa mở'}" ${mo ? '' : 'disabled'}>${mo ? v : icon('khoa')}</button>`;
  }).join('');
  $('tab-album').querySelectorAll('.tab-vung:not(.khoa)').forEach((b) => b.addEventListener('click', () => {
    vungAlbum = Number(b.dataset.vung);
    veAlbum();
  }));

  const levels = levelsCua(vungAlbum);
  $('album-ten-vung').textContent = `Vùng ${vungAlbum} · ${tenVung(vungAlbum)}`;
  $('album-o').innerHTML = levels.map((m) => {
    const co = storage.saoCuaMan(vungAlbum, m.man, d) > 0;
    const laCuoi = m.man === levels.length;
    return `<div class="o-sticker${co ? ' co' : ''}${laCuoi ? ' o-da' : ''}" role="img" aria-label="Sticker màn ${m.man}${co ? '' : ', chưa có'}">
      ${co ? sticker(vungAlbum, m.man) : `<span class="o-sticker-so">${laCuoi ? daNangLuong(false) : m.man}</span>`}
    </div>`;
  }).join('');
  $('album-canh').className = `album-canh canh-album-${vungAlbum}`;
  $('album-canh-sticker').innerHTML = levels.map((m, i) => {
    if (storage.saoCuaMan(vungAlbum, m.man, d) === 0) return '';
    const [x, y] = VI_TRI_STICKER[i % VI_TRI_STICKER.length];
    return `<span class="sticker-dan" style="left:${x}%;top:${y}%;--nghieng:${(i % 3 - 1) * 8}deg">${sticker(vungAlbum, m.man)}</span>`;
  }).join('');
}

$('nut-album').addEventListener('click', () => {
  vungAlbum = vungDangXem;
  veAlbum();
  hienManHinh('album');
});
$('nut-album-ve').addEventListener('click', veBanDo);

// ---------- Màn mở đầu và ảnh của bé ----------
function veLogo() {
  const anh = docAnh();
  $('logo-game').innerHTML = anh
    ? `<div class="logo-anh"><img src="${anh}" alt="Ted"></div>`
    : logoTed();
  $('nut-xoa-anh').hidden = !anh;
}
$('rex-mo-dau').innerHTML = rex({ cuoiTo: true, nhay: true });
$('nut-bat-dau').addEventListener('click', () => {
  noi('Chào Ted! Mình cùng đi phiêu lưu nào!');
  veBanDo();
});

// Nút ảnh dành cho bố mẹ: phải giữ 2 giây mới mở, để bé không bấm nhầm.
let henGioGiu = null;
const nutAnh = $('nut-anh');
nutAnh.addEventListener('pointerdown', () => {
  nutAnh.classList.add('dang-giu');
  henGioGiu = setTimeout(() => {
    nutAnh.classList.remove('dang-giu');
    $('bang-anh').hidden = false;
  }, 2000);
});
['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => nutAnh.addEventListener(ev, () => {
  clearTimeout(henGioGiu);
  nutAnh.classList.remove('dang-giu');
}));
$('nut-chon-anh').addEventListener('click', () => $('chon-anh').click());
$('chon-anh').addEventListener('change', async (e) => {
  const file = e.target.files && e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    await luuAnhTuFile(file);
  } catch (err) {
    $('bang-anh').querySelector('.bang-anh-chu').textContent = 'Ảnh lớn quá hoặc máy không lưu được, thử ảnh khác nhé.';
    return;
  }
  $('bang-anh').hidden = true;
  veLogo();
});
$('nut-xoa-anh').addEventListener('click', () => {
  xoaAnh();
  $('bang-anh').hidden = true;
  veLogo();
});
$('nut-dong-anh').addEventListener('click', () => {
  $('bang-anh').hidden = true;
});

// ---------- Chơi offline ----------
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// ---------- Bắt đầu ----------
veLogo();
hienManHinh('mo-dau');

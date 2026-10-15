// Vùng 1 · Gói bó 10 lá: dạy "10 lá gói lại thành 1 bó, 1 bó là 1 chục".
// Dữ liệu: { kieu: 'goibo', soBo: 2, soLa: 23 }
//   soBo  số bó phải gói xong (đáp án), soLa  số lá lẻ có trên bãi cỏ (>= soBo * 10).
// Ted chạm hoặc kéo từng lá vào khung 10 ô. Đủ 10 ô thì lá buộc lại thành 1 bó.
import { lamKeoTha } from '../core/dragdrop.js';
import { phatTiengCho } from '../core/audio.js';
import { la, boLa } from '../core/art.js';

const CANH_CO = `
  <div class="canh canh-co" aria-hidden="true">
    <div class="mat-troi"></div>
    <div class="may may-1"></div>
    <div class="doi doi-1"></div>
    <div class="doi doi-2"></div>
    <div class="mat-dat"></div>
  </div>`;

export function taoCau(container, cauData, hooks) {
  const { soBo, soLa } = cauData;

  container.innerHTML = `
    <div class="man-goibo">
      ${CANH_CO}
      <div class="khu-tho" id="khu-tho"></div>
      <div class="khu-goi">
        <div class="hang-bo" id="hang-bo" role="status" aria-label="Đã gói 0 bó">
          ${Array.from({ length: soBo }, () => '<span class="cho-bo"></span>').join('')}
        </div>
        <div class="khung-muoi khung-goi" id="khung-goi" role="img" aria-label="Khung 10 ô">
          ${Array.from({ length: 10 }, () => '<span class="o-muoi"></span>').join('')}
        </div>
        <div class="dem-goi" id="dem-goi"><span class="dem-la">${la()}</span><span id="dem-goi-so">0</span></div>
      </div>
    </div>`;

  const khuTho = container.querySelector('#khu-tho');
  const khung = container.querySelector('#khung-goi');
  const oMuoi = [...khung.querySelectorAll('.o-muoi')];
  const choBo = [...container.querySelectorAll('.cho-bo')];
  const hangBo = container.querySelector('#hang-bo');
  const demSo = container.querySelector('#dem-goi-so');

  let trongKhung = 0;
  let daGoi = 0;
  let dangBuoc = false;
  let xongRoi = false;

  function boVaoKhung(el) {
    if (xongRoi || dangBuoc || el.dataset.daVao) return;
    el.dataset.daVao = '1';
    el.remove();
    const o = oMuoi[trongKhung];
    o.innerHTML = la();
    o.classList.add('co-la');
    trongKhung += 1;
    demSo.textContent = String(trongKhung);
    phatTiengCho();
    if (trongKhung === 10) buocBo();
  }

  function buocBo() {
    dangBuoc = true;
    khung.classList.add('dang-buoc');
    setTimeout(() => {
      oMuoi.forEach((o) => { o.innerHTML = ''; o.classList.remove('co-la'); });
      khung.classList.remove('dang-buoc');
      trongKhung = 0;
      demSo.textContent = '0';
      const cho = choBo[daGoi];
      cho.innerHTML = boLa();
      cho.classList.add('co-bo');
      daGoi += 1;
      hangBo.setAttribute('aria-label', `Đã gói ${daGoi} bó`);
      dangBuoc = false;
      if (daGoi >= soBo) {
        xongRoi = true;
        const chuc = daGoi === 1 ? '1 bó là 10 lá, gọi là 1 chục!' : `${daGoi} bó là ${daGoi * 10} lá, là ${daGoi} chục!`;
        hooks.onDung(`Ted gói được ${chuc}`);
      } else if (hooks.noi) {
        hooks.noi(daGoi === 1 ? '10 lá gói lại thành 1 bó. 1 bó là 1 chục!' : `Được ${daGoi} bó rồi! Gói tiếp nào.`);
      }
    }, 900);
  }

  function taoLa(x, y, kt) {
    const el = document.createElement('div');
    el.className = 'vat-pham-keo';
    el.innerHTML = la();
    Object.assign(el.style, { width: `${kt}px`, height: `${kt}px`, left: `${x}px`, top: `${y}px`, animationDelay: `${-Math.random() * 2}s` });
    khuTho.appendChild(el);
    el.addEventListener('click', () => boVaoKhung(el));
    lamKeoTha(el, {
      dichDanhSach: () => [khung],
      onThaVao: (_d, elKeo) => boVaoKhung(elKeo),
    });
  }

  // Rải lá theo lưới có lệch ngẫu nhiên để không chồng lên nhau.
  requestAnimationFrame(() => {
    const rong = khuTho.clientWidth || 600;
    const cao = khuTho.clientHeight || 400;
    let kt = Math.round(Math.max(48, Math.min(96, cao * 0.22, rong * 0.16)));
    let cot;
    let hang;
    for (;;) {
      cot = Math.max(1, Math.floor(rong / (kt * 1.05)));
      hang = Math.max(1, Math.floor(cao / (kt * 1.05)));
      if (cot * hang >= soLa || kt <= 40) break;
      kt = Math.round(kt * 0.92);
    }
    const oRong = rong / cot;
    const oCao = cao / hang;
    const o = Array.from({ length: cot * hang }, (_, i) => i).sort(() => Math.random() - 0.5).slice(0, soLa);
    o.forEach((idx) => {
      const c = idx % cot;
      const h = Math.floor(idx / cot);
      taoLa(c * oRong + Math.random() * Math.max(oRong - kt, 0), h * oCao + Math.random() * Math.max(oCao - kt, 0), kt);
    });
  });

  return {
    goiYDapAn() {
      const el = khuTho.querySelector('.vat-pham-keo');
      if (el) el.classList.add('nhap-nhay');
    },
  };
}

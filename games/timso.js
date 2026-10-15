import { trung } from '../core/art.js';

const CANH_BAI_TRUNG = `
  <div class="canh canh-bai-trung" aria-hidden="true">
    <div class="doi doi-1"></div>
    <div class="nui-lua"></div>
    <div class="mat-cat"></div>
    <div class="to-chim"></div>
  </div>`;

export function taoCau(container, cauData, hooks) {
  // phepTinh (tuỳ chọn), ví dụ '12 + 5': hiện bảng phép tính, bé chạm trứng có kết quả.
  const { soDung, soLuaChon, phepTinh } = cauData;

  container.innerHTML = `
    <div class="man-timso${phepTinh ? ' co-phep-tinh' : ''}">
      ${CANH_BAI_TRUNG}
      ${phepTinh ? `<div class="bang-phep-tinh" aria-label="${phepTinh} bằng mấy">${phepTinh} = <span class="o-hoi" id="o-hoi">?</span></div>` : ''}
      <div class="luoi-trung" id="luoi-trung"></div>
    </div>
  `;
  const oHoi = container.querySelector('#o-hoi');

  const luoiTrung = container.querySelector('#luoi-trung');
  let xongRoi = false;
  const oTheoSo = new Map();

  const thuTu = [...soLuaChon].sort(() => Math.random() - 0.5);

  thuTu.forEach((so, i) => {
    const o = document.createElement('button');
    o.className = 'o-trung';
    o.setAttribute('aria-label', `Trứng số ${so}`);
    o.style.setProperty('--nghieng', `${[-4, 2, -2, 4][i % 4]}deg`);
    o.innerHTML = trung(so, i);
    o.addEventListener('click', () => {
      if (xongRoi) return;
      if (so === soDung) {
        xongRoi = true;
        o.classList.add('dung');
        if (oHoi) {
          oHoi.textContent = String(soDung);
          oHoi.classList.add('da-dien');
        }
        hooks.onDung();
      } else {
        o.classList.remove('sai');
        void o.offsetWidth;
        o.classList.add('sai');
        hooks.onSai();
      }
    });
    luoiTrung.appendChild(o);
    oTheoSo.set(so, o);
  });

  return {
    goiYDapAn() {
      const dung = oTheoSo.get(soDung);
      if (dung) dung.classList.add('goi-y');
    },
    lamMau(xongLamMau) {
      const dung = oTheoSo.get(soDung);
      if (!dung) {
        xongLamMau();
        return;
      }
      dung.classList.add('lam-mau');
      setTimeout(() => {
        dung.classList.remove('lam-mau');
        xongLamMau();
      }, 1400);
    },
  };
}

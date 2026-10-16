import { trung, khungLongCoDai } from '../core/art.js';

const CANH_BAI_TRUNG = `
  <div class="canh canh-bai-trung" aria-hidden="true">
    <div class="doi doi-1"></div>
    <div class="nui-lua"></div>
    <div class="mat-cat"></div>
    <div class="to-chim"></div>
  </div>`;

export function taoCau(container, cauData, hooks) {
  // phepTinh (tuỳ chọn), ví dụ '12 + 5': hiện bảng phép tính, bé chạm trứng có kết quả.
  // hinh: true thì vẽ hai số hạng thành chấm trong khung 10 ô để Ted đếm được (cam là số đầu, xanh là số sau).
  const { soDung, soLuaChon, phepTinh, hinh } = cauData;
  const [soA, soB] = phepTinh ? phepTinh.split('+').map((x) => Number(x.trim())) : [0, 0];
  const veKhung = () => {
    const o = (i) => (i < soA ? '<span class="o-muoi cham-a"><i></i></span>' : i < soA + soB ? '<span class="o-muoi cham-b"><i></i></span>' : '<span class="o-muoi"></span>');
    const khung = (bd) => `<div class="khung-muoi">${Array.from({ length: 10 }, (_, i) => o(bd + i)).join('')}</div>`;
    return `<div class="hang-khung-muoi">${khung(0)}${soA + soB > 10 ? khung(10) : ''}</div>`;
  };
  const coHinh = hinh && phepTinh;

  container.innerHTML = `
    <div class="man-timso${phepTinh ? ' co-phep-tinh' : ''}${coHinh ? ' co-hinh-cong' : ''}">
      ${CANH_BAI_TRUNG}
      <div class="khung-long-canh" aria-hidden="true">${khungLongCoDai(hooks.mauKhungLong).replace('class="vong-mieng"', 'class="vong-mieng" display="none"')}</div>
      ${coHinh ? `<div class="bang-phep-tinh co-hinh" aria-label="${phepTinh} bằng mấy">
        <div><span class="so-a">${soA}</span> + <span class="so-b">${soB}</span> = <span class="o-hoi" id="o-hoi">?</span></div>
        ${veKhung()}
      </div>` : phepTinh ? `<div class="bang-phep-tinh" aria-label="${phepTinh} bằng mấy">${phepTinh} = <span class="o-hoi" id="o-hoi">?</span></div>` : ''}
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
        hooks.onDung(phepTinh
          ? `${soA} cộng ${soB} bằng ${soDung}!`
          : soDung >= 10
            ? `Đúng rồi! ${soDung} là ${Math.floor(soDung / 10)} chục và ${soDung % 10}.`
            : `Đúng rồi, số ${soDung}!`);
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

// Vùng 2 · Chở hàng đúng kho: xe chở thùng chục (10) và thùng lẻ, bé kéo xe về kho có số đúng.
// Dữ liệu: { kieu: 'chohang', xe: [34, 43, 26] }
import { lamKeoTha } from '../core/dragdrop.js';
import { phatTiengCho } from '../core/audio.js';
import { xeTaiHang, khoHang, MAU_XE, CANH_THANH_PHO } from '../core/art-vung2.js';

const tron = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

export function taoCau(container, cauData, hooks) {
  const dsXe = cauData.xe;
  const dsKho = tron(dsXe);

  container.innerHTML = `
    <div class="man-chohang">
      ${CANH_THANH_PHO}
      <div class="khay-xe" aria-hidden="true"></div>
      <div class="cot-kho">
        ${dsKho.map((so) => `
          <div class="kho" data-so="${so}" role="img" aria-label="Kho số ${so}">
            <span class="kho-hinh">${khoHang()}</span>
            <span class="kho-so">${so}</span>
            <span class="kho-xe"></span>
          </div>`).join('')}
      </div>
      <div class="khu-keo" id="khu-keo"></div>
    </div>`;

  const khuKeo = container.querySelector('#khu-keo');
  const cacKho = [...container.querySelectorAll('.kho')];
  let conLai = dsXe.length;
  let xongRoi = false;

  function vaoKho(el, kho) {
    el.remove();
    kho.classList.add('da-co');
    kho.querySelector('.kho-xe').innerHTML = xeTaiHang(Number(kho.dataset.so), el.dataset.mau);
    phatTiengCho();
    conLai--;
    if (conLai === 0 && !xongRoi) {
      xongRoi = true;
      hooks.onDung('Chở đúng hết rồi! Thùng cam là chục, thùng vàng là đơn vị.');
    }
  }

  function xepXe() {
    khuKeo.innerHTML = '';
    const W = khuKeo.clientWidth || 1100;
    const H = khuKeo.clientHeight || 640;
    const rong = W * 0.36;
    const cao = Math.min((H * 0.92) / dsXe.length - 12, rong * 0.6);
    const y0 = (H - (cao + 12) * dsXe.length + 12) / 2;
    dsXe.forEach((so, i) => {
      const mau = MAU_XE[(i + 1) % MAU_XE.length];
      const el = document.createElement('div');
      el.className = 'the-xe';
      el.dataset.so = String(so);
      el.dataset.mau = mau;
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', `Xe chở ${Math.floor(so / 10)} thùng chục và ${so % 10} thùng lẻ`);
      el.innerHTML = xeTaiHang(so, mau);
      el.style.width = `${rong}px`;
      el.style.height = `${cao}px`;
      el.style.left = `${W * 0.03}px`;
      el.style.top = `${y0 + i * (cao + 12)}px`;
      khuKeo.appendChild(el);
      lamKeoTha(el, {
        dichDanhSach: () => cacKho.filter((k) => !k.classList.contains('da-co')),
        onThaVao: (kho, elKeo, kt) => {
          if (xongRoi) return;
          if (kho.dataset.so === elKeo.dataset.so) {
            vaoKho(elKeo, kho);
          } else {
            kt.datLaiViTri();
            kho.classList.remove('lac');
            void kho.offsetWidth;
            kho.classList.add('lac');
            hooks.onSai();
          }
        },
      });
    });
  }

  requestAnimationFrame(xepXe);

  const xeDauTien = () => khuKeo.querySelector('.the-xe');
  const khoCua = (el) => cacKho.find((k) => k.dataset.so === el.dataset.so);

  return {
    goiYDapAn() {
      const el = xeDauTien();
      if (!el) return;
      el.classList.add('goi-y');
      khoCua(el).classList.add('goi-y');
      setTimeout(() => {
        el.classList.remove('goi-y');
        const k = khoCua(el);
        if (k) k.classList.remove('goi-y');
      }, 2500);
    },
    lamMau(xong) {
      const el = xeDauTien();
      if (!el) {
        xong();
        return;
      }
      const kho = khoCua(el);
      const rKeo = khuKeo.getBoundingClientRect();
      const rKho = kho.getBoundingClientRect();
      el.classList.add('dang-bay');
      el.style.left = `${rKho.left - rKeo.left + rKho.width * 0.3}px`;
      el.style.top = `${rKho.top - rKeo.top}px`;
      setTimeout(() => {
        vaoKho(el, kho);
        xong();
      }, 900);
    },
  };
}

// Vùng 2 · Xếp xe từ nhỏ đến lớn: kéo xe từ gara xuống vạch xuất phát, xe số nhỏ nhất trước.
// Dữ liệu: { kieu: 'xepxe', so: [12, 27, 35, 58, 81] }
import { lamKeoTha } from '../core/dragdrop.js';
import { phatTiengCho } from '../core/audio.js';
import { xeDua, oTo, MAU_XE, coDich } from '../core/art-vung2.js';

export function taoCau(container, cauData, hooks) {
  const dsSo = [...cauData.so];
  const thuTuDung = [...dsSo].sort((a, b) => a - b);
  const xaoTron = [...dsSo];
  // Xáo cho tới khi không còn đúng thứ tự sẵn.
  do {
    for (let i = xaoTron.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [xaoTron[i], xaoTron[j]] = [xaoTron[j], xaoTron[i]];
    }
  } while (xaoTron.length > 1 && xaoTron.every((v, i) => v === thuTuDung[i]));

  container.innerHTML = `
    <div class="man-xepxe">
      <div class="canh canh-duong-dua" aria-hidden="true">
        <div class="troi-dd"></div><div class="co-dd"></div>
        <div class="duong-dd"><div class="vach-co"></div></div>
        <div class="co-dich-dd">${coDich()}</div>
      </div>
      <div class="gara" aria-hidden="true"></div>
      <div class="duong-dua" id="duong-dua" aria-label="Vạch xuất phát">
        ${thuTuDung.map((_, i) => `<div class="o-xuat-phat" data-i="${i}"></div>`).join('')}
      </div>
      <div class="nho-den-lon" aria-hidden="true">
        <span class="xe-be">${oTo('#FFFFFF')}</span><span class="mui-ten-lon"></span><span class="xe-to">${oTo('#FFFFFF')}</span>
      </div>
      <div class="khu-keo" id="khu-keo"></div>
    </div>`;

  const khuKeo = container.querySelector('#khu-keo');
  const duongDua = container.querySelector('#duong-dua');
  const cacO = [...container.querySelectorAll('.o-xuat-phat')];
  let daXep = 0;
  let xongRoi = false;

  function datVaoO(el) {
    const o = cacO[daXep];
    o.innerHTML = `${xeDua(null, el.dataset.mau)}<span class="so-xe">${el.dataset.so}</span>`;
    o.classList.add('da-co');
    el.remove();
    daXep++;
    phatTiengCho();
    if (daXep === thuTuDung.length && !xongRoi) {
      xongRoi = true;
      hooks.onDung();
    }
  }

  function xepGara() {
    khuKeo.innerHTML = '';
    const W = khuKeo.clientWidth || 1100;
    const H = khuKeo.clientHeight || 640;
    const n = xaoTron.length;
    const rong = Math.min(W * 0.17, (W * 0.9) / n - 14);
    const cao = Math.min(rong * 0.85, H * 0.31);
    const x0 = (W - (rong + 14) * n + 14) / 2;
    xaoTron.forEach((so, i) => {
      const mau = MAU_XE[(so * 7) % MAU_XE.length];
      const el = document.createElement('div');
      el.className = 'the-xe the-xe-dua';
      el.dataset.so = String(so);
      el.dataset.mau = mau;
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', `Xe số ${so}`);
      el.innerHTML = `${xeDua(null, mau)}<span class="so-xe">${so}</span>`;
      el.style.width = `${rong}px`;
      el.style.height = `${cao}px`;
      el.style.left = `${x0 + i * (rong + 14)}px`;
      el.style.top = `${H * 0.05}px`;
      khuKeo.appendChild(el);
      lamKeoTha(el, {
        dichDanhSach: () => [duongDua],
        onThaVao: (_d, elKeo, kt) => {
          if (xongRoi) return;
          if (Number(elKeo.dataset.so) === thuTuDung[daXep]) {
            datVaoO(elKeo);
          } else {
            kt.datLaiViTri();
            elKeo.classList.remove('lac');
            void elKeo.offsetWidth;
            elKeo.classList.add('lac');
            hooks.onSai();
          }
        },
      });
    });
  }

  requestAnimationFrame(xepGara);

  const xeNhoNhat = () => [...khuKeo.querySelectorAll('.the-xe')].find((el) => Number(el.dataset.so) === thuTuDung[daXep]);

  return {
    goiYDapAn() {
      const el = xeNhoNhat();
      if (!el) return;
      el.classList.add('goi-y');
      cacO[daXep].classList.add('goi-y');
      setTimeout(() => {
        el.classList.remove('goi-y');
        cacO.forEach((o) => o.classList.remove('goi-y'));
      }, 2500);
    },
    lamMau(xong) {
      const el = xeNhoNhat();
      if (!el) {
        xong();
        return;
      }
      const rKeo = khuKeo.getBoundingClientRect();
      const rO = cacO[daXep].getBoundingClientRect();
      el.classList.add('dang-bay');
      el.style.left = `${rO.left - rKeo.left}px`;
      el.style.top = `${rO.top - rKeo.top}px`;
      setTimeout(() => {
        datVaoO(el);
        xong();
      }, 900);
    },
  };
}

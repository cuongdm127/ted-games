// Vùng 2 · Số nào lớn hơn: hai bãi xe có biển số, bé chạm bãi có nhiều (hoặc ít) xe hơn.
// Dữ liệu: { kieu: 'sosanh', trai: 38, phai: 52, hoi: ..., chon: 'lon' | 'nho' }
import { oTo, MAU_XE, CANH_THANH_PHO } from '../core/art-vung2.js';

export function taoCau(container, cauData, hooks) {
  const { trai, phai, chon = 'lon' } = cauData;
  const dung = chon === 'lon' ? Math.max(trai, phai) : Math.min(trai, phai);
  const dau = trai > phai ? '>' : trai < phai ? '<' : '=';

  const bai = (so, ben) => `
    <button class="bai-xe" data-so="${so}" aria-label="Bãi có ${so} xe">
      <span class="hang-xe">${[0, 1, 2].map((i) => `<span class="xe-do">${oTo(MAU_XE[(i + (ben === 'trai' ? 0 : 3)) % MAU_XE.length])}</span>`).join('')}</span>
      <span class="vach-do" aria-hidden="true"></span>
      <span class="bien-so">${so}</span>
    </button>`;

  container.innerHTML = `
    <div class="man-sosanh">
      ${CANH_THANH_PHO}
      <div class="hai-bai">
        ${bai(trai, 'trai')}
        <div class="dau-so-sanh" id="dau-so-sanh" aria-hidden="true">${dau}</div>
        ${bai(phai, 'phai')}
      </div>
    </div>`;

  let xongRoi = false;
  const cacBai = [...container.querySelectorAll('.bai-xe')];
  const baiDung = cacBai.find((b) => Number(b.dataset.so) === dung);
  const dauSoSanh = container.querySelector('#dau-so-sanh');

  cacBai.forEach((b) => {
    b.addEventListener('click', () => {
      if (xongRoi) return;
      if (b === baiDung) {
        xongRoi = true;
        b.classList.add('dung');
        dauSoSanh.classList.add('hien');
        hooks.onDung();
      } else {
        b.classList.remove('sai');
        void b.offsetWidth;
        b.classList.add('sai');
        hooks.onSai();
      }
    });
  });

  return {
    goiYDapAn() {
      baiDung.classList.add('goi-y');
    },
    lamMau(xong) {
      dauSoSanh.classList.add('hien');
      baiDung.classList.add('goi-y');
      setTimeout(() => {
        dauSoSanh.classList.remove('hien');
        xong();
      }, 2200);
    },
  };
}

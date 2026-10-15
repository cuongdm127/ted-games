// Vùng 2 · So sánh hai bãi xe.
// Dữ liệu: { kieu: 'sosanh', trai: 38, phai: 52, chon: 'lon' | 'nho' | 'dau' }
//   'lon' / 'nho': bé chạm bãi có nhiều (ít) xe hơn, đúng thì dấu hiện ra ở giữa.
//   'dau': bé chọn dấu <, =, > đặt vào giữa hai bãi.
// Dấu vẽ thành miệng khủng long, luôn há về phía số lớn hơn.
import { MAU_XE, CANH_THANH_PHO, dauSoSanh, baiXeDem } from '../core/art-vung2.js';

const TEN_DAU = { '<': 'bé hơn', '>': 'lớn hơn', '=': 'bằng' };

export function cauDoc(trai, phai) {
  const dau = trai > phai ? '>' : trai < phai ? '<' : '=';
  return `${trai} ${TEN_DAU[dau]} ${phai}`;
}

export function taoCau(container, cauData, hooks) {
  const { trai, phai, chon = 'lon' } = cauData;
  const chonDau = chon === 'dau';
  const dau = trai > phai ? '>' : trai < phai ? '<' : '=';
  const dung = chon === 'lon' ? Math.max(trai, phai) : Math.min(trai, phai);
  const khen = `Đúng rồi! ${cauDoc(trai, phai)}.`;

  const the = chonDau ? 'div' : 'button';
  const bai = (so, ben) => `
    <${the} class="bai-xe" data-so="${so}" ${chonDau ? 'role="img"' : ''} aria-label="Bãi có ${so} xe">
      <span class="xe-dem">${baiXeDem(so, MAU_XE[ben === 'trai' ? 0 : 1])}</span>
      <span class="bien-so">${so}</span>
    </${the}>`;

  container.innerHTML = `
    <div class="man-sosanh${chonDau ? ' chon-dau' : ''}">
      ${CANH_THANH_PHO}
      <div class="hai-bai">
        ${bai(trai, 'trai')}
        <div class="dau-so-sanh" id="dau-so-sanh" aria-hidden="true">${dauSoSanh('?')}</div>
        ${bai(phai, 'phai')}
      </div>
      ${chonDau ? `<div class="hang-dau">${['<', '=', '>'].map((d) => `
        <button class="nut-dau" data-dau="${d}" aria-label="${TEN_DAU[d]}">
          <span class="nut-dau-hinh">${dauSoSanh(d)}</span><span class="nut-dau-chu">${TEN_DAU[d]}</span>
        </button>`).join('')}</div>` : ''}
    </div>`;

  let xongRoi = false;
  const oDau = container.querySelector('#dau-so-sanh');
  const cacBai = [...container.querySelectorAll('.bai-xe')];
  const cacNutDau = [...container.querySelectorAll('.nut-dau')];
  const baiDung = chonDau ? null : cacBai.find((b) => Number(b.dataset.so) === dung);
  const nutDung = cacNutDau.find((b) => b.dataset.dau === dau);

  function hienDau() {
    oDau.innerHTML = dauSoSanh(dau);
    oDau.classList.remove('hien');
    void oDau.offsetWidth;
    oDau.classList.add('hien');
  }

  function lac(el) {
    el.classList.remove('sai');
    void el.offsetWidth;
    el.classList.add('sai');
  }

  if (chonDau) {
    cacNutDau.forEach((b) => b.addEventListener('click', () => {
      if (xongRoi) return;
      if (b === nutDung) {
        xongRoi = true;
        b.classList.add('dung');
        hienDau();
        hooks.onDung(khen);
      } else {
        lac(b);
        hooks.onSai('Miệng khủng long luôn há về phía số lớn hơn đó!');
      }
    }));
  } else {
    cacBai.forEach((b) => b.addEventListener('click', () => {
      if (xongRoi) return;
      if (b === baiDung) {
        xongRoi = true;
        b.classList.add('dung');
        hienDau();
        hooks.onDung(khen);
      } else {
        lac(b);
        hooks.onSai();
      }
    }));
  }

  return {
    goiYDapAn() {
      (chonDau ? nutDung : baiDung).classList.add('goi-y');
    },
    lamMau(xong) {
      hienDau();
      (chonDau ? nutDung : baiDung).classList.add('goi-y');
      setTimeout(() => hooks.noi && hooks.noi(cauDoc(trai, phai)), 1400);
      setTimeout(() => {
        oDau.innerHTML = dauSoSanh('?');
        oDau.classList.remove('hien');
        (chonDau ? nutDung : baiDung).classList.remove('goi-y');
        xong();
      }, 2600);
    },
  };
}

import { lamKeoTha } from '../core/dragdrop.js';
import { phatTiengCho } from '../core/audio.js';
import { la, boLa, xuong, khungLongCoDai, icon } from '../core/art.js';

const CANH_CO = `
  <div class="canh canh-co" aria-hidden="true">
    <div class="mat-troi"></div>
    <div class="may may-1"></div>
    <div class="may may-2"></div>
    <div class="doi doi-1"></div>
    <div class="doi doi-2"></div>
    <div class="mat-dat"></div>
  </div>`;

export function taoCau(container, cauData, hooks) {
  // soBo: số bó 10 lá có trên bãi cỏ; soLe (hoặc tongLaDung ở dữ liệu cũ): số lá lẻ.
  const { soLuong, soBo = 0, soMoiNhu = 0, layout = 'rai-rac' } = cauData;
  const soLe = cauData.soLe ?? cauData.tongLaDung ?? 0;

  container.innerHTML = `
    <div class="man-dem">
      ${CANH_CO}
      <div class="khu-tho" id="khu-tho"></div>
      <div class="khu-khung-long">
        <div class="khung-long" id="khung-long" role="img" aria-label="Khủng long cổ dài đang há miệng chờ ăn">${khungLongCoDai()}</div>
        <div class="hang-duoi">
          <div class="dem-hien-thi" id="dem-hien-thi" role="status">
            <span class="dem-la">${la()}</span><span class="dem-so" id="dem-so">0</span>
          </div>
          <button class="nut-xong" id="nut-xong" aria-label="Xong rồi">${icon('tich')}</button>
        </div>
      </div>
    </div>
  `;

  const khuTho = container.querySelector('#khu-tho');
  const khungLong = container.querySelector('#khung-long');
  const demHienThi = container.querySelector('#dem-hien-thi');
  const demSo = container.querySelector('#dem-so');
  const nutXong = container.querySelector('#nut-xong');

  let daChoAn = 0;
  let xongRoi = false;
  let kichThuoc = 110;

  function capNhatDem() {
    demSo.textContent = String(daChoAn);
    demHienThi.setAttribute('aria-label', `Đã cho ăn ${daChoAn} lá`);
  }

  function nhayKhungLong() {
    khungLong.classList.remove('nhai');
    void khungLong.offsetWidth;
    khungLong.classList.add('nhai');
    demHienThi.classList.remove('nay');
    void demHienThi.offsetWidth;
    demHienThi.classList.add('nay');
  }

  function lacNhe() {
    khungLong.classList.add('lac-dau');
    setTimeout(() => khungLong.classList.remove('lac-dau'), 500);
  }

  // loai: 'la' (1 lá), 'bo' (bó 10 lá) hoặc 'moi-nhu' (khúc xương).
  function taoVatPham(loai, x, y) {
    const el = document.createElement('div');
    el.className = 'vat-pham-keo' + (loai === 'moi-nhu' ? ' moi-nhu' : '') + (loai === 'bo' ? ' bo-la' : '');
    el.innerHTML = loai === 'la' ? la() : loai === 'bo' ? boLa() : xuong();
    el.dataset.loai = loai;
    el.style.width = `${kichThuoc}px`;
    el.style.height = `${kichThuoc}px`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.animationDelay = `${-Math.random() * 2}s`;
    khuTho.appendChild(el);

    lamKeoTha(el, {
      dichDanhSach: () => [khungLong],
      onThaVao: (_dich, elKeo, kt) => {
        if (xongRoi) return;
        if (elKeo.dataset.loai !== 'moi-nhu') {
          elKeo.remove();
          daChoAn += elKeo.dataset.loai === 'bo' ? 10 : 1;
          capNhatDem();
          nhayKhungLong();
          phatTiengCho();
        } else {
          kt.datLaiViTri();
          lacNhe();
          hooks.onSai();
        }
      },
    });
  }

  // Chia khu thả thành lưới ô, mỗi vật một ô (có lệch ngẫu nhiên) để không chồng lên nhau.
  function taoViTri(tongVat) {
    const rong = khuTho.clientWidth || 700;
    const cao = khuTho.clientHeight || 500;
    kichThuoc = Math.round(Math.max(72, Math.min(120, cao * 0.26, rong * 0.2)));

    if (layout === 'hang') {
      const khoang = Math.min(kichThuoc * 1.35, (rong - kichThuoc) / Math.max(tongVat - 1, 1));
      const tongRong = khoang * (tongVat - 1) + kichThuoc;
      const x0 = Math.max(0, (rong - tongRong) / 2);
      const y = cao / 2 - kichThuoc / 2;
      return Array.from({ length: tongVat }, (_, i) => ({ x: x0 + i * khoang, y }));
    }

    let cot = 1;
    let hang = 1;
    for (;;) {
      cot = Math.max(1, Math.floor(rong / (kichThuoc * 1.08)));
      hang = Math.max(1, Math.floor(cao / (kichThuoc * 1.08)));
      if (cot * hang >= tongVat || kichThuoc <= 60) break;
      kichThuoc = Math.round(kichThuoc * 0.92);
    }
    const oRong = rong / cot;
    const oCao = cao / hang;
    const o = Array.from({ length: cot * hang }, (_, i) => i);
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]];
    }
    return o.slice(0, tongVat).map((idx) => {
      const c = idx % cot;
      const h = Math.floor(idx / cot);
      const duX = Math.max(oRong - kichThuoc, 0);
      const duY = Math.max(oCao - kichThuoc, 0);
      return { x: c * oRong + Math.random() * duX, y: h * oCao + Math.random() * duY };
    });
  }

  function veLaiCau() {
    khuTho.innerHTML = '';
    daChoAn = 0;
    xongRoi = false;
    khungLong.classList.remove('vui');
    capNhatDem();

    const loai = [...Array(soBo).fill('bo'), ...Array(soLe).fill('la'), ...Array(soMoiNhu).fill('moi-nhu')];
    const viTri = taoViTri(loai.length);
    viTri.forEach((p, i) => taoVatPham(loai[i], p.x, p.y));
  }

  // Đợi trình duyệt đo xong kích thước khu thả rồi mới xếp vật.
  requestAnimationFrame(veLaiCau);

  nutXong.addEventListener('click', () => {
    if (xongRoi) return;
    if (daChoAn === soLuong) {
      xongRoi = true;
      khungLong.classList.add('vui');
      hooks.onDung();
    } else {
      hooks.onSai();
    }
  });

  return {
    goiYDapAn() {
      nutXong.classList.add('nhap-nhay');
      setTimeout(() => nutXong.classList.remove('nhap-nhay'), 1500);
    },
    lamMau(xongLamMau) {
      xongRoi = true;
      khuTho.querySelectorAll('.vat-pham-keo').forEach((el) => {
        el.style.opacity = '0.25';
      });
      daChoAn = 0;
      capNhatDem();
      // Rex làm mẫu: cho ăn từng bó 10 trước, rồi từng lá lẻ.
      const buoc = [...Array(Math.floor(soLuong / 10)).fill(10), ...Array(soLuong % 10).fill(1)];
      let i = 0;
      const timer = setInterval(() => {
        if (i >= buoc.length) {
          clearInterval(timer);
          setTimeout(() => {
            veLaiCau();
            xongLamMau();
          }, 500);
          return;
        }
        daChoAn += buoc[i];
        capNhatDem();
        nhayKhungLong();
        phatTiengCho();
        i++;
      }, 700);
    },
  };
}

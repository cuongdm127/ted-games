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
        <div class="khung-long" id="khung-long" role="img" aria-label="Khủng long cổ dài đang há miệng chờ ăn">${khungLongCoDai(hooks.mauKhungLong)}</div>
        <div class="hang-duoi">
          <div class="dem-hien-thi" id="dem-hien-thi" role="status">
            <span class="dem-la">${la()}</span><span class="dem-so" id="dem-so">0</span>
          </div>
          <button class="nut-nha" id="nut-nha" aria-label="Lấy lại lá vừa cho ăn" disabled>${icon('hoanTac')}</button>
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
  const nutNha = container.querySelector('#nut-nha');

  let daChoAn = 0;
  // Các lá/bó đã cho ăn (ẩn đi chứ không xoá) để có thể nhả ra lại đúng chỗ cũ.
  let daAn = [];
  let xongRoi = false;
  let kichThuoc = 110;

  function capNhatDem() {
    demSo.textContent = String(daChoAn);
    demHienThi.setAttribute('aria-label', `Đã cho ăn ${daChoAn} lá`);
    nutNha.disabled = daAn.length === 0 || xongRoi;
  }

  const giaTri = (el) => (el.dataset.loai === 'bo' ? 10 : 1);

  // Nhả lại món vừa ăn gần nhất về chỗ cũ trên bãi cỏ.
  function nhaMotMon() {
    const el = daAn.pop();
    if (!el) return;
    daChoAn -= giaTri(el);
    el.classList.remove('da-an');
    el.classList.remove('nha-ra');
    void el.offsetWidth;
    el.classList.add('nha-ra');
    capNhatDem();
  }

  // Nhả hết (khi cho ăn thừa rồi bấm Xong).
  function nhaHet() {
    while (daAn.length) nhaMotMon();
    lacNhe();
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
          kt.datLaiViTri();
          elKeo.classList.add('da-an');
          daAn.push(elKeo);
          daChoAn += giaTri(elKeo);
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
    daAn = [];
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
      capNhatDem();
      khungLong.classList.add('vui');
      const chuc = Math.floor(soLuong / 10);
      const le = soLuong % 10;
      hooks.onDung(soBo > 0 && chuc > 0
        ? `Đúng ${soLuong} lá: ${chuc} bó${le ? ` và ${le} lá` : ''}!`
        : `Đúng ${soLuong} lá rồi!`);
    } else if (daChoAn > soLuong) {
      // Cho ăn thừa: khủng long nhả hết lá ra để Ted đếm lại từ đầu.
      nhaHet();
      hooks.onSai('Nhiều quá rồi! Khủng long nhả lá ra, mình đếm lại nhé.');
    } else {
      hooks.onSai('Chưa đủ lá đâu, cho khủng long ăn thêm nhé!');
    }
  });

  nutNha.addEventListener('click', () => {
    if (xongRoi) return;
    nhaMotMon();
  });

  function nhapNhay(el) {
    el.classList.remove('nhap-nhay');
    void el.offsetWidth;
    el.classList.add('nhap-nhay');
    setTimeout(() => el.classList.remove('nhap-nhay'), 1500);
  }

  return {
    // Gợi ý tuỳ tình huống: thừa thì chỉ nút nhả lại, đủ thì chỉ nút Xong, thiếu thì chỉ món nên kéo.
    goiYDapAn() {
      if (daChoAn > soLuong) {
        nhapNhay(nutNha);
      } else if (daChoAn === soLuong) {
        nhapNhay(nutXong);
      } else {
        const conThieu = soLuong - daChoAn;
        const chon = conThieu >= 10 ? '.vat-pham-keo.bo-la:not(.da-an)' : '.vat-pham-keo:not(.bo-la):not(.moi-nhu):not(.da-an)';
        const el = khuTho.querySelector(chon) || khuTho.querySelector('.vat-pham-keo:not(.moi-nhu):not(.da-an)');
        if (el) nhapNhay(el);
      }
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

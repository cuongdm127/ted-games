// Lưu tiến độ trên máy (localStorage). Dữ liệu cũ { vung1: { man1: { saoCaoNhat } } } vẫn đọc được.
//
// Cấu trúc:
// {
//   vung1: { man1: { saoCaoNhat: 3 }, ... }, vung2: {...},
//   ruongDaMo: 0,                 // số rương đã mở
//   doDaCo: ['ao-do', ...],       // đồ đã có
//   doMac: { ao: 'ao-do', ... },  // đồ đang mặc / gắn lên xe
//   daDaXem: [1],                 // vùng đã xem màn ăn mừng Đá Năng Lượng
// }

import { DO_MAC_DINH, DO_CO_SAN } from './items.js';

// Chế độ thử cho bố mẹ: mở link với ?test ở cuối. Mọi vùng, mọi màn đều mở;
// tiến độ lưu riêng nên không ảnh hưởng tiến độ thật của bé.
export const CHE_DO_THU = (() => {
  try {
    return new URLSearchParams(location.search).has('test');
  } catch (e) {
    return false;
  }
})();

const KEY = CHE_DO_THU ? 'ted-game-save-test' : 'ted-game-save';

function chuanHoa(data) {
  if (!data || typeof data !== 'object') data = {};
  if (!data.vung1) data.vung1 = {};
  if (typeof data.ruongDaMo !== 'number') data.ruongDaMo = 0;
  if (!Array.isArray(data.doDaCo)) data.doDaCo = [];
  for (const id of DO_CO_SAN) if (!data.doDaCo.includes(id)) data.doDaCo.push(id);
  data.doMac = { ...DO_MAC_DINH, ...(data.doMac || {}) };
  if (!Array.isArray(data.daDaXem)) data.daDaXem = [];
  return data;
}

export function docTienDo() {
  try {
    const raw = localStorage.getItem(KEY);
    return chuanHoa(raw ? JSON.parse(raw) : null);
  } catch (e) {
    return chuanHoa(null);
  }
}

function ghiTienDo(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    // bỏ qua nếu localStorage không dùng được (ví dụ chế độ ẩn danh)
  }
}

function capNhat(thayDoi) {
  const data = docTienDo();
  thayDoi(data);
  ghiTienDo(data);
  return data;
}

function saoCuaMan(vung, man, data = docTienDo()) {
  const thongTin = data[`vung${vung}`] && data[`vung${vung}`][`man${man}`];
  return thongTin ? thongTin.saoCaoNhat : 0;
}

function luuMan(vung, man, sao) {
  return capNhat((data) => {
    const k = `vung${vung}`;
    if (!data[k]) data[k] = {};
    const cu = data[k][`man${man}`];
    data[k][`man${man}`] = { saoCaoNhat: cu ? Math.max(cu.saoCaoNhat, sao) : sao };
  });
}

/** Vùng mở khi vùng trước đã xong màn cuối. soManMoiVung: số màn của vùng trước. */
function vungDaMo(vung, data = docTienDo(), soManVungTruoc = 7) {
  if (vung <= 1 || CHE_DO_THU) return true;
  return saoCuaMan(vung - 1, soManVungTruoc, data) > 0;
}

function manDaMo(vung, man, data = docTienDo(), soManVungTruoc = 7) {
  if (CHE_DO_THU) return true;
  if (man === 1) return vungDaMo(vung, data, soManVungTruoc);
  return saoCuaMan(vung, man - 1, data) > 0;
}

/** Tổng sao (cao nhất) của mọi màn đã chơi. */
function tongSao(data = docTienDo()) {
  let tong = 0;
  for (const [k, v] of Object.entries(data)) {
    if (!/^vung\d+$/.test(k)) continue;
    for (const m of Object.values(v)) tong += m.saoCaoNhat || 0;
  }
  return tong + (data.saoThu || 0);
}

function moRuong(idDo) {
  return capNhat((data) => {
    data.ruongDaMo += 1;
    if (idDo && !data.doDaCo.includes(idDo)) data.doDaCo.push(idDo);
  });
}

function mac(oDo, idDo) {
  return capNhat((data) => {
    data.doMac[oDo] = idDo;
  });
}

function danhDauDaXem(vung) {
  return capNhat((data) => {
    if (!data.daDaXem.includes(vung)) data.daDaXem.push(vung);
  });
}

// Chỉ dùng trong chế độ thử: cộng sao để thử rương quà, và xoá tiến độ thử.
function themSaoThu(n) {
  if (!CHE_DO_THU) return docTienDo();
  return capNhat((data) => {
    data.saoThu = (data.saoThu || 0) + n;
  });
}

function xoaTienDoThu() {
  if (!CHE_DO_THU) return;
  try {
    localStorage.removeItem(KEY);
  } catch (e) {
    // bỏ qua
  }
}

export const storage = {
  docTienDo, luuMan, saoCuaMan, manDaMo, vungDaMo, tongSao, moRuong, mac, danhDauDaXem, themSaoThu, xoaTienDoThu,
};

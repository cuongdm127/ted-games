let ctx = null;

export function khoiTaoAm() {
  if (ctx) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  ctx = new AudioCtx();
  if (ctx.state === 'suspended') ctx.resume();
}

function phatToneDon(tanSo, batDau, thoiGian, loai = 'sine', amLuong = 0.2) {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = loai;
  osc.frequency.value = tanSo;
  gain.gain.value = amLuong;
  osc.connect(gain);
  gain.connect(ctx.destination);
  const t0 = ctx.currentTime + batDau;
  osc.start(t0);
  gain.gain.setValueAtTime(amLuong, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + thoiGian);
  osc.stop(t0 + thoiGian + 0.02);
}

export function phatDung() {
  // tiếng "hoan hô" khi làm đúng cả câu / qua màn
  phatToneDon(523, 0, 0.14, 'triangle', 0.18);
  phatToneDon(659, 0.1, 0.14, 'triangle', 0.18);
  phatToneDon(784, 0.2, 0.14, 'triangle', 0.18);
  phatToneDon(1047, 0.3, 0.35, 'triangle', 0.22);
  phatToneDon(1319, 0.3, 0.35, 'sine', 0.12);
}

export function phatSai() {
  phatToneDon(220, 0, 0.25, 'triangle', 0.12);
}

export function phatTiengCho() {
  // tiếng "ting" nhẹ khi thả đúng 1 vật phẩm (ví dụ 1 lá) vào khủng long
  phatToneDon(1046, 0, 0.1, 'sine', 0.16);
}

export function layAudioCtx() {
  return ctx;
}

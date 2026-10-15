export function lamKeoTha(el, { onThaVao, dichDanhSach }) {
  let batDau = null;
  let viTriGoc = null;
  let controller;

  function layViTriHienTai() {
    return {
      left: parseFloat(el.style.left) || 0,
      top: parseFloat(el.style.top) || 0,
    };
  }

  function timDichTrung(x, y) {
    const list = typeof dichDanhSach === 'function' ? dichDanhSach() : dichDanhSach;
    for (const dich of list) {
      const r = dich.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return dich;
    }
    return null;
  }

  function onPointerMove(e) {
    if (!batDau) return;
    const dx = e.clientX - batDau.x;
    const dy = e.clientY - batDau.y;
    el.style.left = `${viTriGoc.left + dx}px`;
    el.style.top = `${viTriGoc.top + dy}px`;
  }

  function onPointerUp(e) {
    el.classList.remove('dang-keo');
    try {
      el.releasePointerCapture(e.pointerId);
    } catch (err) {
      // bỏ qua nếu con trỏ đã nhả trước đó
    }
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerup', onPointerUp);
    const dich = timDichTrung(e.clientX, e.clientY);
    if (dich) {
      onThaVao(dich, el, controller);
    } else {
      controller.datLaiViTri();
    }
    batDau = null;
  }

  function onPointerDown(e) {
    e.preventDefault();
    try {
      el.setPointerCapture(e.pointerId);
    } catch (err) {
      // bỏ qua nếu thiết bị không hỗ trợ
    }
    batDau = { x: e.clientX, y: e.clientY };
    viTriGoc = layViTriHienTai();
    el.classList.add('dang-keo');
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
  }

  el.addEventListener('pointerdown', onPointerDown);

  controller = {
    huyBo() {
      el.removeEventListener('pointerdown', onPointerDown);
    },
    datLaiViTri() {
      el.style.left = `${viTriGoc.left}px`;
      el.style.top = `${viTriGoc.top}px`;
    },
  };

  return controller;
}

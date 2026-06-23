let _resolve = null;

function openConfirm(msg) {
  document.getElementById('confirmMsg').textContent = msg;
  document.getElementById('confirmModal').hidden = false;

  return new Promise((resolve) => {
    _resolve = resolve;
  });
}

function closeConfirm(result) {
  document.getElementById('confirmModal').hidden = true;
  if (_resolve) {
    _resolve(result);
    _resolve = null;
  }
}

function initConfirmModal() {
  document.getElementById('confirmOk').addEventListener('click', () => closeConfirm(true));
  document.getElementById('confirmCancel').addEventListener('click', () => closeConfirm(false));
  document.getElementById('confirmClose').addEventListener('click', () => closeConfirm(false));
  document.getElementById('confirmBackdrop').addEventListener('click', () => closeConfirm(false));
}

window.openConfirm = openConfirm;
window.initConfirmModal = initConfirmModal;

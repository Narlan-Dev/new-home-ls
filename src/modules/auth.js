const AUTH_KEY = 'sl_user';
let _onLoginCallback = null;

function getUser() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(AUTH_KEY);
}

function updateNavButton() {
  const btn = document.getElementById('authBtn');
  if (!btn) return;
  const user = getUser();
  if (user) {
    btn.textContent = user.name.split(' ')[0];
    btn.classList.add('is-logged');
  } else {
    btn.textContent = 'entrar';
    btn.classList.remove('is-logged');
  }
}

function showStatus(msg, type) {
  const el = document.getElementById('authStatus');
  el.textContent = msg;
  el.className = 'auth-modal__status is-' + type;
  el.hidden = false;
}

function hideStatus() {
  const el = document.getElementById('authStatus');
  el.hidden = true;
}

function openModal(onLogin) {
  _onLoginCallback = onLogin || null;
  document.getElementById('authModal').hidden = false;
  hideStatus();
  const user = getUser();
  if (user) {
    document.getElementById('authName').value = user.name;
    document.getElementById('authPhone').value = user.phone;
  }
}

function closeModal() {
  document.getElementById('authModal').hidden = true;
}

async function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('authName').value.trim();
  const phone = document.getElementById('authPhone').value.trim();

  if (!name || !phone) {
    showStatus('Preencha todos os campos.', 'error');
    return;
  }

  const submitBtn = document.querySelector('.auth-modal__submit');
  setButtonLoading(submitBtn, true);

  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      showStatus(data.error || 'Erro ao entrar.', 'error');
      setButtonLoading(submitBtn, false);
      return;
    }

    setUser(data.user);
    updateNavButton();
    updateAdminUI();
    closeModal();

    if (_onLoginCallback) {
      const cb = _onLoginCallback;
      _onLoginCallback = null;
      cb(data.user);
    } else if (window.loadGifts) {
      loadGifts();
    }
  } catch {
    showStatus('Erro de conexão.', 'error');
  } finally {
    setButtonLoading(submitBtn, false);
  }
}

function initAuth() {
  updateNavButton();
  updateAdminUI();

  document.getElementById('authBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const user = getUser();
    if (user) {
      openConfirm(`Sair como ${user.name}?`).then((confirmed) => {
        if (!confirmed) return;
        clearUser();
        updateNavButton();
        updateAdminUI();
        if (window.loadGifts) loadGifts();
      });
    } else {
      openModal();
    }
  });

  document.getElementById('authClose').addEventListener('click', closeModal);
  document.getElementById('authBackdrop').addEventListener('click', closeModal);
  document.getElementById('authForm').addEventListener('submit', handleSubmit);
}

function updateAdminUI() {
  const user = getUser();
  const isAdmin = user && user.role === 'ADMIN';
  const addBtn = document.getElementById('addGiftBtn');
  if (addBtn) addBtn.hidden = !isAdmin;
}

window.initAuth = initAuth;
window.getUser = getUser;
window.updateAdminUI = updateAdminUI;
window.openAuthModal = openModal;

let _giftsCache = [];

const CATEGORY_CHIP = {
  cozinha: 'jd-chip--verde',
  eletro: 'jd-chip--magenta',
  quarto: 'jd-chip--amarelo',
  banho: 'jd-chip--amarelo',
};

function formatPrice(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function renderGiftCard(gift) {
  const chipClass = CATEGORY_CHIP[gift.category] || '';
  const link = gift.link || '#';
  const image = gift.image_url || '/public/gift.png';
  const user = window.getUser ? getUser() : null;
  const isAdmin = user && user.role === 'ADMIN';
  const isMine = user && gift.selected_by === user.id;
  const isTaken = gift.selected_by && !isMine;

  const cardClass = isTaken && isAdmin ? 'gift-card is-taken-admin' : isTaken ? 'gift-card is-taken' : isMine ? 'gift-card is-mine' : 'gift-card';

  let selectBtn = '';
  if (isTaken && isAdmin) {
    selectBtn = `<button class="jd-btn jd-btn--ghost gift-card__deselect" data-gift="${gift.id}">desmarcar</button>`;
  } else if (isTaken) {
    selectBtn = `<button class="jd-btn jd-btn--ghost gift-card__select" disabled>já escolhido</button>`;
  } else if (isMine) {
    selectBtn = `<button class="jd-btn jd-btn--ghost gift-card__select is-selected" disabled>selecionado ✓</button>`;
    if (isAdmin) {
      selectBtn = `<button class="jd-btn jd-btn--ghost gift-card__deselect is-selected" data-gift="${gift.id}">desmarcar</button>`;
    }
  } else {
    selectBtn = `<button class="jd-btn jd-btn--ghost gift-card__select" data-gift="${gift.id}">escolhi esse</button>`;
  }

  return `
    <div class="${cardClass}" data-gift-id="${gift.id}">
      <img class="gift-card__img" src="${image}" alt="${gift.name}" />
      <div class="gift-card__top">
        <span class="jd-chip ${chipClass}">${gift.category}</span>
        ${isTaken && !isAdmin ? '<span class="jd-chip gift-card__taken-chip">indisponível</span>' : ''}
      </div>
      <h3 class="gift-card__name">${gift.name}</h3>
      <p class="gift-card__desc">${gift.description || ''}</p>
      <div class="gift-card__price">${formatPrice(gift.price)}</div>
      <div class="gift-card__actions">
        <a class="jd-btn jd-btn--primary gift-card__link" href="${link}" target="_blank" rel="noopener">comprar →</a>
        ${selectBtn}
      </div>
    </div>
  `;
}

async function loadGifts() {
  const container = document.getElementById('giftsContainer');
  if (!container) return;

  if (!_giftsCache.length) {
    container.innerHTML = '<div class="sl-gifts-loading"><div class="sl-spinner sl-spinner--lg"></div></div>';
  }

  try {
    const res = await fetch('/api/gifts');
    _giftsCache = await res.json();
    container.innerHTML = _giftsCache.map(renderGiftCard).join('');
    container.classList.add('in');
    bindGiftButtons();
  } catch {
    container.innerHTML = '<p style="color:var(--jd-muted)">Erro ao carregar presentes.</p>';
  }
}

function findGiftById(id) {
  return _giftsCache.find((g) => g.id === Number(id));
}

function bindGiftButtons() {
  document.querySelectorAll('.gift-card__select:not([disabled])').forEach((btn) => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); handleGiftSelect(btn); });
  });
  document.querySelectorAll('.gift-card__deselect').forEach((btn) => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); handleGiftDeselect(btn); });
  });
  document.querySelectorAll('.gift-card__link').forEach((a) => {
    a.addEventListener('click', (e) => e.stopPropagation());
  });
  document.querySelectorAll('.gift-card').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const gift = findGiftById(card.dataset.giftId);
      if (gift) openGiftItem(gift);
    });
  });
}

async function confirmAndSelect(btn, user) {
  const card = btn.closest('.gift-card');
  const giftName = card.querySelector('.gift-card__name').textContent;
  const confirmed = await openConfirm(`Deseja selecionar "${giftName}" como seu presente?`);
  if (!confirmed) return;

  setButtonLoading(btn, true);

  try {
    const res = await fetch(`/api/gifts/${btn.dataset.gift}/select`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId: user.id }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      setButtonLoading(btn, false);
      return;
    }

    loadGifts();
  } catch {
    alert('Erro de conexão.');
    setButtonLoading(btn, false);
  }
}

async function handleGiftSelect(btn) {
  const user = window.getUser ? getUser() : null;

  if (!user) {
    openAuthModal((loggedUser) => {
      loadGifts().then(() => {
        const newBtn = document.querySelector(`.gift-card__select[data-gift="${btn.dataset.gift}"]`);
        if (newBtn && !newBtn.disabled) confirmAndSelect(newBtn, loggedUser);
      });
    });
    return;
  }

  confirmAndSelect(btn, user);
}

async function handleGiftDeselect(btn) {
  const user = window.getUser ? getUser() : null;
  if (!user || user.role !== 'ADMIN') return;

  const card = btn.closest('.gift-card');
  const giftName = card.querySelector('.gift-card__name').textContent;
  const confirmed = await openConfirm(`Desmarcar "${giftName}"? Essa ação libera o presente para outros.`);
  if (!confirmed) return;

  setButtonLoading(btn, true);

  try {
    const res = await fetch(`/api/gifts/${btn.dataset.gift}/deselect`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId: user.id, role: user.role }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error);
      setButtonLoading(btn, false);
      return;
    }

    loadGifts();
  } catch {
    alert('Erro de conexão.');
    setButtonLoading(btn, false);
  }
}

window.loadGifts = loadGifts;

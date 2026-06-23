function openGiftItem(gift) {
  const body = document.getElementById('giftItemBody');
  const image = gift.image_url || '/public/gift.png';
  const link = gift.link || '#';
  const user = window.getUser ? getUser() : null;
  const isAdmin = user && user.role === 'ADMIN';
  const isMine = user && gift.selected_by === user.id;
  const isTaken = !!gift.selected_by;

  let statusHtml = '';
  if (isTaken) {
    const who = isMine ? 'Você selecionou este presente' : `Selecionado por ${gift.selected_by_name || 'alguém'}`;
    statusHtml = `
      <div class="gift-item__status is-taken">
        <span class="gift-item__status-dot"></span>
        ${who}
      </div>
    `;
  } else {
    statusHtml = `
      <div class="gift-item__status is-available">
        <span class="gift-item__status-dot"></span>
        Disponível para presentear
      </div>
    `;
  }

  let actionsHtml = `<a class="jd-btn jd-btn--primary" href="${link}" target="_blank" rel="noopener">comprar →</a>`;

  if (!isTaken) {
    actionsHtml += `<button class="jd-btn jd-btn--ghost" id="giftItemSelect" data-gift="${gift.id}">escolhi esse</button>`;
  } else if (isAdmin) {
    actionsHtml += `<button class="jd-btn jd-btn--ghost" id="giftItemDeselect" data-gift="${gift.id}">desmarcar</button>`;
  }

  let adminHtml = '';
  if (isAdmin) {
    adminHtml = `
      <div class="gift-item__admin">
        <button class="jd-btn jd-btn--ghost gift-item__edit" id="giftItemEdit">editar</button>
        <button class="jd-btn jd-btn--ghost gift-item__delete" id="giftItemDelete">excluir</button>
      </div>
    `;
  }

  body.innerHTML = `
    <img class="gift-item__img" src="${image}" alt="${gift.name}" />
    <div class="gift-item__header">
      <h3 class="gift-item__name">${gift.name}</h3>
      <span class="gift-item__price">${formatPrice(gift.price)}</span>
    </div>
    <span class="jd-chip ${CATEGORY_CHIP[gift.category] || ''}">${gift.category}</span>
    <p class="gift-item__desc">${gift.description || 'Sem descrição.'}</p>
    ${statusHtml}
    <div class="gift-item__actions">${actionsHtml}</div>
    ${adminHtml}
  `;

  document.getElementById('giftItemModal').hidden = false;

  const selectBtn = document.getElementById('giftItemSelect');
  if (selectBtn) {
    selectBtn.addEventListener('click', async () => {
      closeGiftItem();
      const cardBtn = document.querySelector(`.gift-card__select[data-gift="${gift.id}"]`);
      if (cardBtn) handleGiftSelect(cardBtn);
    });
  }

  const deselectBtn = document.getElementById('giftItemDeselect');
  if (deselectBtn) {
    deselectBtn.addEventListener('click', async () => {
      closeGiftItem();
      const cardBtn = document.querySelector(`.gift-card__deselect[data-gift="${gift.id}"]`);
      if (cardBtn) handleGiftDeselect(cardBtn);
    });
  }

  const editBtn = document.getElementById('giftItemEdit');
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      closeGiftItem();
      openAddGift(gift);
    });
  }

  const deleteBtn = document.getElementById('giftItemDelete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const msg = isTaken
        ? `"${gift.name}" já foi selecionado por ${gift.selected_by_name || 'alguém'}. Tem certeza que deseja excluir?`
        : `Excluir "${gift.name}"?`;

      const confirmed = await openConfirm(msg);
      if (!confirmed) return;

      try {
        const res = await fetch(`/api/gifts/${gift.id}/delete`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ role: user.role }),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error);
          return;
        }
        closeGiftItem();
        if (window.loadGifts) loadGifts();
      } catch {
        alert('Erro de conexão.');
      }
    });
  }
}

function closeGiftItem() {
  document.getElementById('giftItemModal').hidden = true;
}

function initGiftItem() {
  document.getElementById('giftItemClose').addEventListener('click', closeGiftItem);
  document.getElementById('giftItemBackdrop').addEventListener('click', closeGiftItem);
}

window.openGiftItem = openGiftItem;
window.closeGiftItem = closeGiftItem;
window.initGiftItem = initGiftItem;

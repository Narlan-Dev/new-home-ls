let _editingGiftId = null;

function openAddGift(gift) {
  const form = document.getElementById('addGiftForm');
  const tag = document.querySelector('#addGiftModal .jd-tag');
  const submitBtn = document.querySelector('.add-gift-modal__submit');

  form.reset();
  hideAddGiftStatus();

  if (gift) {
    _editingGiftId = gift.id;
    tag.textContent = 'editar presente';
    submitBtn.textContent = 'salvar alterações →';
    document.getElementById('addGiftName').value = gift.name || '';
    document.getElementById('addGiftCategory').value = gift.category || '';
    document.getElementById('addGiftPrice').value = gift.price || '';
    document.getElementById('addGiftDesc').value = gift.description || '';
    document.getElementById('addGiftLink').value = gift.link || '';
    document.getElementById('addGiftImage').value = gift.image_url || '';
    updateImagePreview(gift.image_url || '');
  } else {
    _editingGiftId = null;
    tag.textContent = 'novo presente';
    submitBtn.textContent = 'adicionar presente →';
    updateImagePreview('');
  }

  document.getElementById('addGiftModal').hidden = false;
}

function closeAddGift() {
  document.getElementById('addGiftModal').hidden = true;
  _editingGiftId = null;
}

function updateImagePreview(url) {
  const preview = document.getElementById('addGiftPreview');
  if (url && url.trim()) {
    preview.innerHTML = `<img src="${url}" alt="Preview" onerror="this.parentElement.innerHTML='<span class=\\'add-gift-modal__preview-placeholder\\'>imagem não encontrada</span>'" />`;
  } else {
    preview.innerHTML = '<span class="add-gift-modal__preview-placeholder">preview da imagem</span>';
  }
}

function showAddGiftStatus(msg, type) {
  const el = document.getElementById('addGiftStatus');
  el.textContent = msg;
  el.className = 'add-gift-modal__status is-' + type;
  el.hidden = false;
}

function hideAddGiftStatus() {
  document.getElementById('addGiftStatus').hidden = true;
}

async function handleAddGiftSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('addGiftName').value.trim();
  const category = document.getElementById('addGiftCategory').value;
  const price = parseFloat(document.getElementById('addGiftPrice').value);
  const description = document.getElementById('addGiftDesc').value.trim();
  const link = document.getElementById('addGiftLink').value.trim();
  const image_url = document.getElementById('addGiftImage').value.trim();

  if (!name || !category || isNaN(price)) {
    showAddGiftStatus('Preencha nome, categoria e preço.', 'error');
    return;
  }

  const user = window.getUser ? getUser() : null;
  if (!user || user.role !== 'ADMIN') {
    showAddGiftStatus('Apenas administradores.', 'error');
    return;
  }

  const payload = { name, category, description, price, link, image_url, userId: user.id, role: user.role };
  const submitBtn = document.querySelector('.add-gift-modal__submit');
  setButtonLoading(submitBtn, true);

  try {
    const isEdit = !!_editingGiftId;
    const url = isEdit ? `/api/gifts/${_editingGiftId}/update` : '/api/gifts';
    const method = 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      showAddGiftStatus(data.error || 'Erro.', 'error');
      setButtonLoading(submitBtn, false);
      return;
    }

    setButtonLoading(submitBtn, false);
    closeAddGift();
    if (window.loadGifts) loadGifts();
  } catch {
    showAddGiftStatus('Erro de conexão.', 'error');
    setButtonLoading(submitBtn, false);
  }
}

function initAddGift() {
  document.getElementById('addGiftClose').addEventListener('click', closeAddGift);
  document.getElementById('addGiftBackdrop').addEventListener('click', closeAddGift);
  document.getElementById('addGiftForm').addEventListener('submit', handleAddGiftSubmit);
  document.getElementById('addGiftBtn').addEventListener('click', () => openAddGift());

  document.getElementById('addGiftImage').addEventListener('input', (e) => {
    updateImagePreview(e.target.value);
  });
}

window.openAddGift = openAddGift;
window.initAddGift = initAddGift;

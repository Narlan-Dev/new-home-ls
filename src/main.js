const sections = [
  '/pages/home/nav.html',
  '/pages/home/hero.html',
  '/pages/home/stats.html',
  '/pages/home/about.html',
  '/pages/home/schedule.html',
  '/pages/home/gifts/gifts.html',
  '/pages/home/faq.html',
  '/pages/home/pix.html',
  '/pages/home/footer.html',
  '/components/auth-modal/auth-modal.html',
  '/components/confirm-modal/confirm-modal.html',
  '/components/gift-item/gift-item.html',
  '/components/add-gift-modal/add-gift-modal.html',
];

Promise.all(sections.map((s) => fetch(s).then((r) => r.text()))).then(
  (htmls) => {
    document.getElementById('app').innerHTML = htmls.join('\n');
    init();
  },
);

function dismissPageLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  loader.classList.add('is-done');
  setTimeout(() => loader.remove(), 400);
}

function setButtonLoading(btn, loading) {
  if (loading) {
    btn.classList.add('is-loading');
    if (!btn.querySelector('.sl-spinner')) {
      btn.dataset.originalText = btn.textContent;
      btn.innerHTML = `<span class="sl-btn-text">${btn.textContent}</span><div class="sl-spinner"></div>`;
    }
  } else {
    btn.classList.remove('is-loading');
    btn.textContent = btn.dataset.originalText || btn.textContent;
  }
}

window.setButtonLoading = setButtonLoading;

function loadScript(src) {
  return new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    document.body.appendChild(s);
  });
}

function init() {
  const burger = document.getElementById('burger');
  const links = document.getElementById('navlinks');
  burger.addEventListener('click', () => links.classList.toggle('open'));
  links
    .querySelectorAll('a')
    .forEach((a) =>
      a.addEventListener('click', () => links.classList.remove('open')),
    );

  document.getElementById('copyPix').addEventListener('click', () => {
    navigator.clipboard.writeText('73991154203').then(() => {
      const btn = document.getElementById('copyPix');
      btn.textContent = 'copiado!';
      setTimeout(() => (btn.textContent = 'copiar chave PIX →'), 2000);
    });
  });

  if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document
      .querySelectorAll('.reveal')
      .forEach((el) => el.classList.add('in'));
  }

  Promise.all([
    loadScript('/components/confirm-modal/confirm-modal.js'),
    loadScript('/components/gift-item/gift-item.js'),
    loadScript('/components/gift-card/gift-card.js'),
    loadScript('/components/add-gift-modal/add-gift-modal.js'),
    loadScript('/modules/auth.js'),
  ]).then(async () => {
    initConfirmModal();
    initGiftItem();
    initAddGift();
    initAuth();
    await loadGifts();
    dismissPageLoader();
  });
}

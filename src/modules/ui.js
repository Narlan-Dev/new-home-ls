export const $ = id => document.getElementById(id);

export function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function showStatus(message, type) {
  const el = $('genStatus');
  el.hidden = false;
  el.className = `gen-status is-${type}`;
  el.innerHTML = message;
}

export function setGenerating(loading) {
  const btn = $('generateBtn');
  btn.disabled = loading;
  btn.innerHTML = loading
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Gerando…`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 3l14 9-14 9V3z"/></svg> Gerar Aula`;
}

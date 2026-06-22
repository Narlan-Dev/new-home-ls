import { $, escHtml } from './ui.js';

let objetivoCount = 0;

export function addObjetivo(value = '') {
  const container = $('objetivosContainer');
  const idx = objetivoCount++;
  const row = document.createElement('div');
  row.className = 'objetivo-row';
  row.dataset.idx = idx;
  row.innerHTML = `
    <input type="text" class="gen-input" name="objetivo_${idx}"
      placeholder="O aluno consegue fazer X…" value="${escHtml(value)}">
    <button type="button" class="btn-remove" data-action="remove-objetivo" title="Remover">×</button>
  `;
  container.appendChild(row);
}

export function removeObjetivo(btn) {
  const container = $('objetivosContainer');
  if (container.children.length <= 1) return;
  btn.closest('.objetivo-row').remove();
}

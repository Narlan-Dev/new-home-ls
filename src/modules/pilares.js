import { $ } from './ui.js';

export function buildPilaresInputs() {
  const container = $('pilaresItens');
  container.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const div = document.createElement('div');
    div.className = 'pilar-card';
    div.innerHTML = `
      <div class="pilar-card__num">0${i + 1}</div>
      <div class="field">
        <label class="field-label">Título</label>
        <input type="text" class="gen-input" name="pilar_titulo_${i}" placeholder="Pilar ${i + 1}">
      </div>
      <div class="field" style="margin-top:8px">
        <label class="field-label">Descrição</label>
        <input type="text" class="gen-input" name="pilar_desc_${i}" placeholder="Descrição curta.">
      </div>
    `;
    container.appendChild(div);
  }
}

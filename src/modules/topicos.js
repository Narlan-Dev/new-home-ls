import { $, escHtml } from './ui.js';

let topicoCount = 0;

export function addTopico(data = {}) {
  const container = $('topicosContainer');
  const id = topicoCount++;
  const num = String(id + 1).padStart(2, '0');
  const card = document.createElement('div');
  card.className = 'topico-card';
  card.dataset.id = id;

  const conteudoMode = data.ia_generate ? 'ia' : 'manual';
  const atividadeMode = (data.atividade && data.atividade.ia_generate) ? 'ia' : 'manual';
  const atividade = data.atividade || {};
  const codigo = data.codigo || {};
  const hasCode = !!data.codigo;
  const imagem = data.imagem || {};
  const hasImage = !!data.imagem;

  card.innerHTML = `
    <div class="topico-card__header" data-action="toggle-topico" data-id="${id}">
      <span class="topico-card__num">${num}</span>
      <span class="topico-card__title">${escHtml(data.titulo || 'Novo tópico')}</span>
      <svg class="topico-card__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      <button type="button" class="topico-card__remove" data-action="remove-topico" data-id="${id}" title="Remover tópico">×</button>
    </div>
    <div class="topico-card__body">

      <div class="field">
        <label class="field-label">Título do Tópico</label>
        <input type="text" class="gen-input topico-titulo-input" name="topico_titulo_${id}"
          placeholder="ex: O que é um algoritmo?" value="${escHtml(data.titulo || '')}"
          data-action="sync-topico-title" data-id="${id}">
      </div>

      <div class="subsection">
        <span class="subsection__title">Conteúdo</span>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" name="topico_conteudo_mode_${id}" value="manual"
              ${conteudoMode === 'manual' ? 'checked' : ''}
              data-action="toggle-conteudo-mode" data-id="${id}" data-mode="manual">
            Preencher manualmente
          </label>
          <label class="radio-label">
            <input type="radio" name="topico_conteudo_mode_${id}" value="ia"
              ${conteudoMode === 'ia' ? 'checked' : ''}
              data-action="toggle-conteudo-mode" data-id="${id}" data-mode="ia">
            <span style="color:var(--jd-magenta)">ia_generate</span> — Claude cria automaticamente
          </label>
        </div>
        <div id="conteudoManual_${id}" ${conteudoMode === 'ia' ? 'hidden' : ''} style="margin-top:10px">
          <textarea class="gen-input gen-textarea" name="topico_conteudo_${id}"
            rows="4" placeholder="Explicação do conteúdo. Seja direto — vai virar slide.">${escHtml(data.conteudo || '')}</textarea>
        </div>
        <div id="conteudoIA_${id}" ${conteudoMode !== 'ia' ? 'hidden' : ''} style="margin-top:8px">
          <p style="font-size:.85rem;color:var(--jd-muted);margin:0 0 10px;line-height:1.5">
            O Claude vai criar o conteúdo do slide a partir do título do tópico,
            mantendo coerência pedagógica com a aula.
          </p>
          <div class="field">
            <label class="field-label" style="font-size:.85rem">Descrição / dica <span style="color:var(--jd-muted);font-weight:400">(opcional)</span></label>
            <textarea class="gen-input gen-textarea" name="topico_ia_descricao_${id}"
              rows="2" placeholder="Oriente o Claude: foco, abordagem, exemplos específicos, nível de profundidade...">${escHtml(data.descricao || '')}</textarea>
          </div>
        </div>
      </div>

      <!-- Código (opcional) -->
      <div class="subsection">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span class="subsection__title">Bloco de Código</span>
          <label class="toggle-label" style="font-size:.85rem;gap:8px">
            <input type="checkbox" class="gen-toggle" name="topico_has_codigo_${id}"
              data-action="toggle-codigo" data-id="${id}"
              ${hasCode ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            incluir
          </label>
        </div>
        <div id="codigoFields_${id}" ${hasCode ? '' : 'hidden'}>
          <div class="subsection__fields">
            <div class="field">
              <label class="field-label">Nome do arquivo</label>
              <input type="text" class="gen-input" name="topico_codigo_arquivo_${id}"
                placeholder="exemplo.py" value="${escHtml(codigo.arquivo || '')}">
            </div>
            <div class="field">
              <label class="field-label">Código</label>
              <textarea class="gen-input gen-textarea" name="topico_codigo_linhas_${id}"
                rows="4" placeholder="Código sem formatação especial — o Claude aplica as cores automaticamente.">${escHtml(codigo.linhas || '')}</textarea>
            </div>
            <div class="field">
              <label class="field-label">Anatomia (uma explicação por linha)</label>
              <div class="anatomia-list" id="anatomiaList_${id}">
                ${buildAnatomiaInputs(id, codigo.anatomia || ['', '', ''])}
              </div>
              <button type="button" class="btn-add" style="margin-top:6px"
                data-action="add-anatomia" data-id="${id}">
                <span>+</span> adicionar linha
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Imagem (opcional) -->
      <div class="subsection">
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span class="subsection__title">Slide de Imagem</span>
          <label class="toggle-label" style="font-size:.85rem;gap:8px">
            <input type="checkbox" class="gen-toggle" name="topico_has_imagem_${id}"
              data-action="toggle-imagem" data-id="${id}"
              ${hasImage ? 'checked' : ''}>
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            incluir
          </label>
        </div>
        <div id="imagemFields_${id}" ${hasImage ? '' : 'hidden'}>
          <div class="subsection__fields">
            <div class="field">
              <label class="field-label">URL da imagem</label>
              <input type="url" class="gen-input" name="topico_imagem_url_${id}"
                placeholder="https://..." value="${escHtml(imagem.url || '')}">
            </div>
            <div class="field">
              <label class="field-label">Texto ao lado <span style="color:var(--jd-muted);font-weight:400">(opcional — aparece à esquerda da imagem)</span></label>
              <textarea class="gen-input gen-textarea" name="topico_imagem_texto_${id}"
                rows="3" placeholder="Se preenchido, o slide usa layout de duas colunas: texto à esquerda, imagem à direita.">${escHtml(imagem.texto || '')}</textarea>
            </div>
            <div class="field">
              <label class="field-label">Legenda <span style="color:var(--jd-muted);font-weight:400">(opcional)</span></label>
              <input type="text" class="gen-input" name="topico_imagem_legenda_${id}"
                placeholder="Descrição curta exibida abaixo da imagem." value="${escHtml(imagem.legenda || '')}">
            </div>
          </div>
        </div>
      </div>

      <!-- Atividade -->
      <div class="subsection">
        <span class="subsection__title">Atividade</span>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" name="topico_atividade_mode_${id}" value="manual"
              ${atividadeMode === 'manual' ? 'checked' : ''}
              data-action="toggle-atividade-mode" data-id="${id}" data-mode="manual">
            Preencher manualmente
          </label>
          <label class="radio-label">
            <input type="radio" name="topico_atividade_mode_${id}" value="ia"
              ${atividadeMode === 'ia' ? 'checked' : ''}
              data-action="toggle-atividade-mode" data-id="${id}" data-mode="ia">
            <span style="color:var(--jd-magenta)">ia_generate</span> — Claude cria automaticamente
          </label>
        </div>
        <div id="atividadeManual_${id}" ${atividadeMode === 'ia' ? 'hidden' : ''}>
          <div class="subsection__fields" style="margin-top:12px">
            <div class="field">
              <label class="field-label">Título da atividade</label>
              <input type="text" class="gen-input" name="topico_ativ_titulo_${id}"
                placeholder="ex: Algoritmo do cotidiano" value="${escHtml(atividade.titulo || '')}">
            </div>
            <div class="field">
              <label class="field-label">Enunciado</label>
              <textarea class="gen-input gen-textarea" name="topico_ativ_enunciado_${id}"
                rows="3" placeholder="O que o aluno deve fazer.">${escHtml(atividade.enunciado || '')}</textarea>
            </div>
            <div class="field-grid" style="grid-template-columns:1fr 1fr">
              <div class="field">
                <label class="field-label">Tipo</label>
                <select class="gen-input gen-select atividade-tipo-select" name="topico_ativ_tipo_${id}">
                  <option value="reflexao" ${atividade.tipo === 'reflexao' ? 'selected' : ''}>reflexão</option>
                  <option value="codigo" ${atividade.tipo === 'codigo' ? 'selected' : ''}>código</option>
                  <option value="quiz" ${atividade.tipo === 'quiz' ? 'selected' : ''}>quiz</option>
                </select>
              </div>
              <div class="field" style="justify-content:flex-end;padding-top:24px">
                <label class="toggle-label">
                  <input type="checkbox" class="gen-toggle" name="topico_ativ_uso_ia_${id}"
                    ${atividade.uso_ia ? 'checked' : ''}>
                  <span class="toggle-track"><span class="toggle-thumb"></span></span>
                  permite uso de IA
                </label>
              </div>
            </div>
          </div>
        </div>
        <div id="atividadeIA_${id}" ${atividadeMode !== 'ia' ? 'hidden' : ''} style="margin-top:8px">
          <p style="font-size:.85rem;color:var(--jd-muted);margin:0;line-height:1.5">
            O Claude vai criar título, enunciado e tipo a partir do conteúdo e código do tópico.
            A dificuldade é ajustada progressivamente em relação aos tópicos anteriores.
          </p>
        </div>
      </div>

    </div>
  `;

  container.appendChild(card);
  updateTopicoNumbers();
}

export function buildAnatomiaInputs(id, items) {
  return items.map((v, i) => `
    <div class="anatomia-row">
      <input type="text" class="gen-input" name="topico_codigo_anatomia_${id}_${i}"
        placeholder="Explicação da linha ${i + 1}" value="${escHtml(v)}">
      <button type="button" class="btn-remove" data-action="remove-anatomia" title="Remover">×</button>
    </div>
  `).join('');
}

export function addAnatomia(topicoId) {
  const list = $(`anatomiaList_${topicoId}`);
  const count = list.children.length;
  const row = document.createElement('div');
  row.className = 'anatomia-row';
  row.innerHTML = `
    <input type="text" class="gen-input" name="topico_codigo_anatomia_${topicoId}_${count}"
      placeholder="Explicação da linha ${count + 1}">
    <button type="button" class="btn-remove" data-action="remove-anatomia" title="Remover">×</button>
  `;
  list.appendChild(row);
}

export function removeAnatomia(btn) {
  const list = btn.closest('.anatomia-list');
  if (list.children.length <= 1) return;
  btn.closest('.anatomia-row').remove();
}

export function removeTopico(btn) {
  const container = $('topicosContainer');
  if (container.children.length <= 1) return;
  const id = btn.dataset.id;
  document.querySelector(`.topico-card[data-id="${id}"]`).remove();
  updateTopicoNumbers();
}

export function toggleTopico(id) {
  document.querySelector(`.topico-card[data-id="${id}"]`).classList.toggle('is-collapsed');
}

export function syncTopicoTitle(id, value) {
  const card = document.querySelector(`.topico-card[data-id="${id}"]`);
  card.querySelector('.topico-card__title').textContent = value || 'Novo tópico';
}

export function toggleCodigo(id, show) {
  $(`codigoFields_${id}`).hidden = !show;
}

export function toggleImagem(id, show) {
  $(`imagemFields_${id}`).hidden = !show;
}

export function toggleConteudoMode(id, mode) {
  $(`conteudoManual_${id}`).hidden = (mode === 'ia');
  $(`conteudoIA_${id}`).hidden = (mode === 'manual');
}

export function toggleAtividadeMode(id, mode) {
  $(`atividadeManual_${id}`).hidden = (mode === 'ia');
  $(`atividadeIA_${id}`).hidden = (mode === 'manual');
}

export function updateTopicoNumbers() {
  document.querySelectorAll('.topico-card').forEach((card, i) => {
    card.querySelector('.topico-card__num').textContent = String(i + 1).padStart(2, '0');
  });
}

import { $, showStatus } from './modules/ui.js';
import { loadSettings, saveSettings } from './modules/settings.js';
import { addObjetivo, removeObjetivo } from './modules/objetivos.js';
import {
  addTopico,
  addAnatomia,
  removeAnatomia,
  removeTopico,
  toggleTopico,
  syncTopicoTitle,
  toggleCodigo,
  toggleImagem,
  toggleConteudoMode,
  toggleAtividadeMode,
} from './modules/topicos.js';
import { buildPilaresInputs } from './modules/pilares.js';
import { collectFormData } from './modules/collect.js';
import { generate, showPreview, downloadFile } from './modules/generate.js';

function init() {
  loadSettings();
  buildPilaresInputs();
  addObjetivo('O aluno consegue fazer X');
  addObjetivo('O aluno entende Y');
  addObjetivo('O aluno aplica Z');
  addTopico({ titulo: 'Tópico 1', conteudo: '' });

  // API settings panel
  $('settingsBtn').onclick = () => {
    $('settingsPanel').hidden = !$('settingsPanel').hidden;
  };
  $('saveApiKey').onclick = saveSettings;
  $('toggleApiKey').onclick = () => {
    const input = $('apiKeyInput');
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    $('toggleApiKey').textContent = isPassword ? 'ocultar' : 'mostrar';
  };

  // Pilares / Princípio toggles
  $('pilaresToggle').onchange = (e) => {
    $('pilaresBody').hidden = !e.target.checked;
  };
  $('principioToggle').onchange = (e) => {
    $('principioBody').hidden = !e.target.checked;
  };

  // Add buttons
  $('addObjetivoBtn').onclick = () => addObjetivo();
  $('addTopicoBtn').onclick = () => addTopico();

  // Copiar prompt para Claude Code / claude.ai
  $('copyPromptBtn').onclick = () => {
    const data = collectFormData();
    const aulaId = String(data.aula).padStart(2, '0');
    const prompt = `Gera slides.html e apostila.html para a aula abaixo. Salve em output/aula-${aulaId}/ seguindo o design system.\n\nJSON:\n${JSON.stringify(data, null, 2)}`;
    navigator.clipboard.writeText(prompt).then(() => {
      showStatus('Prompt copiado! Cole no Claude Code (VS Code) ou em claude.ai para gerar o material.', 'success');
    }).catch(() => {
      $('jsonPreview').textContent = prompt;
      $('jsonModal').hidden = false;
    });
  };

  // JSON preview modal
  $('previewJsonBtn').onclick = () => {
    $('jsonPreview').textContent = JSON.stringify(collectFormData(), null, 2);
    $('jsonModal').hidden = false;
  };
  $('closeJsonModal').onclick = () => {
    $('jsonModal').hidden = true;
  };
  $('jsonModalBackdrop').onclick = () => {
    $('jsonModal').hidden = true;
  };

  // Close preview frame
  $('closePreviewBtn').onclick = () => {
    $('previewFrame').hidden = true;
    $('previewIframe').src = '';
  };

  // Form submit
  $('aulaForm').onsubmit = generate;

  // Spin animation for loading state
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);

  // Handles all dynamic elements created by addTopico() and addObjetivo()
  $('objetivosContainer').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="remove-objetivo"]');
    if (btn) removeObjetivo(btn);
  });

  $('topicosContainer').addEventListener('click', (e) => {
    const removeAnatomiaBtn = e.target.closest(
      '[data-action="remove-anatomia"]',
    );
    if (removeAnatomiaBtn) {
      removeAnatomia(removeAnatomiaBtn);
      return;
    }

    const addAnatomiaBtn = e.target.closest('[data-action="add-anatomia"]');
    if (addAnatomiaBtn) {
      addAnatomia(addAnatomiaBtn.dataset.id);
      return;
    }

    const removeTopicoBtn = e.target.closest('[data-action="remove-topico"]');
    if (removeTopicoBtn) {
      e.stopPropagation();
      removeTopico(removeTopicoBtn);
      return;
    }

    const header = e.target.closest('[data-action="toggle-topico"]');
    if (header) toggleTopico(header.dataset.id);
  });

  $('topicosContainer').addEventListener('input', (e) => {
    const input = e.target.closest('[data-action="sync-topico-title"]');
    if (input) syncTopicoTitle(input.dataset.id, input.value);
  });

  $('topicosContainer').addEventListener('change', (e) => {
    const codigoToggle = e.target.closest('[data-action="toggle-codigo"]');
    if (codigoToggle) {
      toggleCodigo(codigoToggle.dataset.id, codigoToggle.checked);
      return;
    }

    const imagemToggle = e.target.closest('[data-action="toggle-imagem"]');
    if (imagemToggle) {
      toggleImagem(imagemToggle.dataset.id, imagemToggle.checked);
      return;
    }

    const conteudoRadio = e.target.closest('[data-action="toggle-conteudo-mode"]');
    if (conteudoRadio) {
      toggleConteudoMode(conteudoRadio.dataset.id, conteudoRadio.dataset.mode);
      return;
    }

    const atividadeRadio = e.target.closest(
      '[data-action="toggle-atividade-mode"]',
    );
    if (atividadeRadio)
      toggleAtividadeMode(
        atividadeRadio.dataset.id,
        atividadeRadio.dataset.mode,
      );
  });
}

document.addEventListener('DOMContentLoaded', init);

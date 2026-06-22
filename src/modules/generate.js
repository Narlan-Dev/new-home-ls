import { $, showStatus, setGenerating } from './ui.js';
import { getApiKey } from './settings.js';
import { callClaude, extractHtml } from './api.js';
import { collectFormData } from './collect.js';

let slidesHtml = '';
let apostilaHtml = '';

export async function generate(e) {
  e.preventDefault();

  const apiKey = getApiKey();
  if (!apiKey) {
    showStatus('Configure sua chave de API clicando no botão "API" no canto superior direito.', 'error');
    $('settingsPanel').hidden = false;
    return;
  }

  const data = collectFormData();
  if (!data.titulo) {
    showStatus('Preencha ao menos o título da aula antes de gerar.', 'error');
    return;
  }

  const jsonStr = JSON.stringify(data, null, 2);
  const aulaId = String(data.aula).padStart(2, '0');

  setGenerating(true);
  $('genOutput').hidden = true;
  slidesHtml = '';
  apostilaHtml = '';

  try {
    showStatus(`Gerando slides.html<span class="gen-loading-dots"></span>`, 'loading');
    slidesHtml = extractHtml(await callClaude(
      `Gera slides.html para a aula abaixo. Retorne APENAS o HTML completo.\n\nJSON:\n${jsonStr}`
    ));

    showStatus(`Gerando apostila.html<span class="gen-loading-dots"></span>`, 'loading');
    apostilaHtml = extractHtml(await callClaude(
      `Gera apostila.html para a aula abaixo. Retorne APENAS o HTML completo.\n\nJSON:\n${jsonStr}`
    ));

    showStatus(`Material da aula ${aulaId} gerado com sucesso.`, 'success');
    renderOutput(aulaId);

  } catch (err) {
    showStatus(`Erro: ${err.message}`, 'error');
  } finally {
    setGenerating(false);
  }
}

export function renderOutput(aulaId) {
  const output = $('genOutput');
  output.hidden = false;
  output.scrollIntoView({ behavior: 'smooth', block: 'start' });

  $('downloadSlidesBtn').onclick = () => downloadFile(slidesHtml, 'slides.html');
  $('downloadApostilaBtn').onclick = () => downloadFile(apostilaHtml, 'apostila.html');
  $('previewSlidesBtn').onclick = () => showPreview(slidesHtml, 'slides.html');
  $('previewApostilaBtn').onclick = () => showPreview(apostilaHtml, 'apostila.html');
}

export function showPreview(html, label) {
  const frame = $('previewFrame');
  $('previewLabel').textContent = label;
  frame.hidden = false;
  const blob = new Blob([html], { type: 'text/html' });
  $('previewIframe').src = URL.createObjectURL(blob);
  frame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

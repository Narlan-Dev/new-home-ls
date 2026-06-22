import { $, showStatus } from './ui.js';

export function loadSettings() {
  $('apiKeyInput').value = localStorage.getItem('jd_api_key') || '';
  $('modelSelect').value = localStorage.getItem('jd_model') || 'claude-sonnet-4-6';
}

export function saveSettings() {
  const key = $('apiKeyInput').value.trim();
  const model = $('modelSelect').value;
  localStorage.setItem('jd_api_key', key);
  localStorage.setItem('jd_model', model);
  showStatus('Configurações salvas.', 'success');
  setTimeout(() => $('settingsPanel').hidden = true, 800);
}

export function getApiKey() {
  return localStorage.getItem('jd_api_key') || $('apiKeyInput').value.trim();
}

export function getModel() {
  return $('modelSelect').value || 'claude-sonnet-4-6';
}

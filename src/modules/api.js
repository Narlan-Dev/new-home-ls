import { SYSTEM_PROMPT } from './system-prompt.js';
import { getApiKey, getModel } from './settings.js';

export async function callClaude(userMessage) {
  const apiKey = getApiKey();
  if (!apiKey)
    throw new Error(
      'Chave de API não configurada. Clique em "API" no canto superior direito.',
    );

  const response = await fetch('/api/proxy', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: getModel(),
      max_tokens: 30000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Erro ${response.status}: ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

export function extractHtml(raw) {
  const match =
    raw.match(/```html\s*([\s\S]*?)```/) || raw.match(/```\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  const trimmed = raw.trim();
  if (trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html'))
    return trimmed;
  return trimmed;
}

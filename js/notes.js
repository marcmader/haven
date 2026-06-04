import { loadSettings, loadNotes, saveNotes } from './storage.js';

/**
 * Render or remove the Quick Notes panel based on settings.showQuickNotes.
 * Safe to call multiple times — idempotent.
 */
export function initNotes() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  const settings = loadSettings();
  const existing = heroSection.querySelector('.quick-notes-panel');

  if (!settings.showQuickNotes) {
    heroSection.classList.remove('hero-section--expanded');
    existing?.remove();
    return;
  }

  heroSection.classList.add('hero-section--expanded');

  if (existing) return; // already rendered

  const panel = document.createElement('div');
  panel.className = 'quick-notes-panel';

  const title = document.createElement('div');
  title.className = 'quick-notes-title';
  title.textContent = 'Quick Notes';

  const textarea = document.createElement('textarea');
  textarea.className = 'quick-notes-textarea';
  textarea.placeholder = 'Notizen…';
  textarea.value = loadNotes();

  const hint = document.createElement('div');
  hint.className = 'quick-notes-hint';
  hint.textContent = 'Autosave · nur lokal gespeichert';

  textarea.addEventListener('input', () => saveNotes(textarea.value));

  panel.append(title, textarea, hint);
  heroSection.appendChild(panel);
}

import { loadSettings, saveSettings, loadLinks, loadStats, incrementOpenCount } from './storage.js';
import { detectLang, getGreeting, t } from './i18n.js';
import { applyTheme, updateLogoColors, applyCustomTheme, watchSystemTheme } from './theme.js';
import { startClock } from './clock.js';
import { loadQuotes, getDailyQuote, renderQuote } from './quotes.js';
import { initWeather, startWeatherRefresh } from './weather.js';
import { renderCategories } from './links.js';
import { initSettings } from './settings.js';
import { initNotes } from './notes.js';
import { renderHelp } from './help.js';

document.addEventListener('DOMContentLoaded', async () => {

  // ── 1. Load persistent state ─────────────────────────────────
  const settings = loadSettings();
  const data     = loadLinks();
  const lang     = detectLang(settings.lang);

  // ── 2. Apply theme ───────────────────────────────────────────
  applyTheme(settings.theme === 'custom' ? 'dark' : settings.theme);
  if (settings.customTheme) applyCustomTheme(settings.customTheme);
  updateLogoColors();

  // Keep logo colors in sync when OS theme changes (for auto mode)
  watchSystemTheme(() => {
    if (settings.theme === 'auto') updateLogoColors();
  });

  // ── 3. Clock ─────────────────────────────────────────────────
  const clockEl = document.getElementById('clock-time');
  const dateEl  = document.getElementById('clock-date');
  let clockId = startClock({ clockEl, dateEl }, lang);

  // ── 4. Quotes ────────────────────────────────────────────────
  try {
    const quotes = await loadQuotes();
    const quote  = getDailyQuote(quotes);
    renderQuote(quote, {
      textEl:   document.getElementById('quote-text'),
      authorEl: document.getElementById('quote-author'),
    });
  } catch (err) {
    console.warn('Haven: failed to load quotes', err.message);
  }

  // ── 5. Weather ───────────────────────────────────────────────
  const weatherEls = {
    iconEl:     document.getElementById('w-icon'),
    tempEl:     document.getElementById('w-temp'),
    cityEl:     document.getElementById('w-city'),
    descEl:     document.getElementById('w-desc'),
    forecastEl: document.getElementById('fc-pills'),
  };
  initWeather(weatherEls, lang);
  startWeatherRefresh(weatherEls, lang);

  // ── 6. Settings modal (before links so we have the control object) ───
  const contentEl = document.getElementById('content');
  const greetingEl = document.getElementById('greeting');
  const settingsCtrl = initSettings({
    greetingEl,
    statLinksEl: document.getElementById('stat-links'),
    statCatsEl:  document.getElementById('stat-cats'),
    statTodayEl: document.getElementById('stat-today'),
    categoriesContainer: contentEl,
    clockEl,
    dateEl,
    startClock,
    _clockId: clockId,
  });

  // ── 7. Quick Notes ───────────────────────────────────────────
  initNotes();

  // ── 8. Links ─────────────────────────────────────────────────
  renderCategories(data, settings, contentEl, {
    onAddLink: (catId) => settingsCtrl.openToAddLink(catId),
  });

  // ── 9. Greeting ──────────────────────────────────────────────
  _renderGreeting(greetingEl, lang, settings.userName);

  // ── 10. Stats ─────────────────────────────────────────────────
  const stats = incrementOpenCount();
  _renderStats(data, stats, lang);

  // ── 11. Search ────────────────────────────────────────────────
  document.getElementById('search-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const query = document.getElementById('search-input')?.value.trim();
    if (query) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    }
  });

  // Update search placeholder with i18n
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.placeholder = t(lang, 'searchPlaceholder');

  // Update modal title with i18n
  const modalTitle = document.getElementById('modal-title');
  if (modalTitle) modalTitle.textContent = t(lang, 'settingsTitle');

  // ── 12. Edit mode toggle ──────────────────────────────────────────────
  const editBtn = document.getElementById('edit-mode-btn');
  editBtn?.addEventListener('click', () => {
    const active = document.body.classList.toggle('edit-mode');
    editBtn.classList.toggle('active', active);
  });

  // ── 13. Help modal ────────────────────────────────────────────────────
  const helpOverlay = document.getElementById('help-modal');
  renderHelp(lang);

  document.getElementById('help-btn')?.addEventListener('click', () => {
    helpOverlay?.classList.add('open');
  });

  document.getElementById('help-close-btn')?.addEventListener('click', () => {
    helpOverlay?.classList.remove('open');
  });

  helpOverlay?.addEventListener('click', e => {
    if (e.target === helpOverlay) helpOverlay.classList.remove('open');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') helpOverlay?.classList.remove('open');
  });
});

// ── Helpers ──────────────────────────────────────────────────────

function _renderGreeting(greetingEl, lang, userName) {
  if (!greetingEl) return;
  const base = getGreeting(lang, '');
  if (userName) {
    greetingEl.innerHTML = `${base}, <span class="greeting-name">${userName}</span>`;
  } else {
    greetingEl.textContent = base;
  }
}

function _renderStats(data, stats, lang) {
  const totalLinks = data.categories.reduce((sum, c) => sum + c.links.length, 0);

  const linksEl = document.getElementById('stat-links');
  const catsEl  = document.getElementById('stat-cats');
  const todayEl = document.getElementById('stat-today');

  if (linksEl) linksEl.textContent = totalLinks;
  if (catsEl)  catsEl.textContent  = data.categories.length;
  if (todayEl) todayEl.textContent = stats.openCount;

  // i18n stat labels
  const llEl = document.getElementById('stat-links-label');
  const clEl = document.getElementById('stat-cats-label');
  const tlEl = document.getElementById('stat-today-label');
  if (llEl) llEl.textContent = t(lang, 'linksLabel');
  if (clEl) clEl.textContent = t(lang, 'categoriesLabel');
  if (tlEl) tlEl.textContent = t(lang, 'todayLabel');
}

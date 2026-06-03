import { formatDate } from './i18n.js';

/**
 * Start the clock, updating every second.
 * @param {{ clockEl: HTMLElement, dateEl: HTMLElement }} elements
 * @param {string} lang — active language code ('de'|'en'|'fr'|'es')
 * @returns {number} intervalId — call clearInterval(id) to stop
 */
export function startClock(elements, lang) {
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    elements.clockEl.textContent = `${h}:${m}:${s}`;
    elements.dateEl.textContent = formatDate(now, lang);
  }
  tick();
  return setInterval(tick, 1000);
}
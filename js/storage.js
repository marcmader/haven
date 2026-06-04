export const KEYS = {
  links:       'haven_links',
  settings:    'haven_settings',
  stats:       'haven_stats',
  customTheme: 'haven_custom_theme',
  notes:       'haven_notes',
};

// ── Links ──────────────────────────────────────────────────────────────────

/** @returns {{ categories: Array }} */
export function loadLinks() {
  try {
    const raw = localStorage.getItem(KEYS.links);
    return raw ? JSON.parse(raw) : { categories: [] };
  } catch {
    return { categories: [] };
  }
}

/** @param {{ categories: Array }} data */
export function saveLinks(data) {
  try {
    localStorage.setItem(KEYS.links, JSON.stringify(data));
  } catch (e) {
    console.warn('Haven: could not save links', e);
  }
}

// ── Settings ───────────────────────────────────────────────────────────────

const SETTINGS_DEFAULTS = {
  theme:          'auto',
  lang:           null,
  userName:       '',
  linkTarget:     '_blank',
  customTheme:    null,
  showQuickNotes: false,
};

/** @returns {{ theme: string, lang: string|null, userName: string, linkTarget: string, customTheme: object|null }} */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEYS.settings);
    return raw ? { ...SETTINGS_DEFAULTS, ...JSON.parse(raw) } : { ...SETTINGS_DEFAULTS };
  } catch {
    return { ...SETTINGS_DEFAULTS };
  }
}

/** @param {{ theme: string, lang: string|null, userName: string, linkTarget: string, customTheme: object|null }} settings */
export function saveSettings(settings) {
  try {
    localStorage.setItem(KEYS.settings, JSON.stringify(settings));
  } catch (e) {
    console.warn('Haven: could not save settings', e);
  }
}

// ── Stats ──────────────────────────────────────────────────────────────────

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

/** @returns {{ date: string, openCount: number }} */
export function loadStats() {
  try {
    const raw = localStorage.getItem(KEYS.stats);
    if (!raw) return { date: todayString(), openCount: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.date !== todayString()) return { date: todayString(), openCount: 0 };
    return parsed;
  } catch {
    return { date: todayString(), openCount: 0 };
  }
}

/** @param {{ date: string, openCount: number }} stats */
export function saveStats(stats) {
  try {
    localStorage.setItem(KEYS.stats, JSON.stringify(stats));
  } catch (e) {
    console.warn('Haven: could not save stats', e);
  }
}

/** Increment today's open count and return updated stats. */
export function incrementOpenCount() {
  const stats = loadStats();
  stats.openCount += 1;
  saveStats(stats);
  return stats;
}

// ── Notes ─────────────────────────────────────────────────────────────────

/** @returns {string} */
export function loadNotes() {
  return localStorage.getItem(KEYS.notes) ?? '';
}

/** @param {string} text */
export function saveNotes(text) {
  try {
    localStorage.setItem(KEYS.notes, text);
  } catch (e) {
    console.warn('Haven: could not save notes', e);
  }
}

// ── Export / Import ────────────────────────────────────────────────────────

/** @returns {string} JSON string of all haven_ localStorage keys */
export function exportJSON() {
  const data = {};
  for (const key of Object.values(KEYS)) {
    const val = localStorage.getItem(key);
    if (val !== null) {
      try {
        data[key] = JSON.parse(val);
      } catch {
        // Skip corrupted keys
      }
    }
  }
  return JSON.stringify(data, null, 2);
}

/**
 * Restore all haven_ keys from a JSON string.
 * @param {string} jsonString
 * @throws {SyntaxError} if jsonString is not valid JSON
 * @throws {TypeError} if parsed value is not an object
 */
export function importJSON(jsonString) {
  const data = JSON.parse(jsonString);
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new TypeError('Import data must be a JSON object');
  }
  for (const [key, value] of Object.entries(data)) {
    if (Object.values(KEYS).includes(key)) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn(`Haven: could not import key ${key}`, e);
      }
    }
  }
}

// ── UUID helper ────────────────────────────────────────────────────────────

/** @returns {string} a random UUID */
export function uuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

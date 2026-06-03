export const KEYS = {
  links: 'haven_links',
  settings: 'haven_settings',
  stats: 'haven_stats',
  customTheme: 'haven_custom_theme',
};

// ── Links ──────────────────────────────────────────────────────────────────

export function loadLinks() {
  try {
    const raw = localStorage.getItem(KEYS.links);
    return raw ? JSON.parse(raw) : { categories: [] };
  } catch {
    return { categories: [] };
  }
}

export function saveLinks(data) {
  localStorage.setItem(KEYS.links, JSON.stringify(data));
}

// ── Settings ───────────────────────────────────────────────────────────────

/** @returns {{ theme: string, lang: string|null, userName: string, linkTarget: string, customTheme: object|null }} */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEYS.settings);
    const defaults = {
      theme: 'auto',
      lang: null,
      userName: '',
      linkTarget: '_blank',
      customTheme: null,
    };
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return { theme: 'auto', lang: null, userName: '', linkTarget: '_blank', customTheme: null };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(KEYS.settings, JSON.stringify(settings));
}

// ── Stats ──────────────────────────────────────────────────────────────────

function todayString() {
  return new Date().toISOString().slice(0, 10); // "2026-06-03"
}

export function loadStats() {
  try {
    const raw = localStorage.getItem(KEYS.stats);
    if (!raw) return { date: todayString(), openCount: 0 };
    const parsed = JSON.parse(raw);
    // Reset if day changed
    if (parsed.date !== todayString()) return { date: todayString(), openCount: 0 };
    return parsed;
  } catch {
    return { date: todayString(), openCount: 0 };
  }
}

export function saveStats(stats) {
  localStorage.setItem(KEYS.stats, JSON.stringify(stats));
}

export function incrementOpenCount() {
  const stats = loadStats();
  stats.openCount += 1;
  saveStats(stats);
  return stats;
}

// ── Export / Import ────────────────────────────────────────────────────────

export function exportJSON() {
  const data = {};
  for (const key of Object.values(KEYS)) {
    const val = localStorage.getItem(key);
    if (val !== null) data[key] = JSON.parse(val);
  }
  return JSON.stringify(data, null, 2);
}

export function importJSON(jsonString) {
  const data = JSON.parse(jsonString); // throws on invalid JSON
  for (const [key, value] of Object.entries(data)) {
    if (Object.values(KEYS).includes(key)) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

// ── UUID helper ────────────────────────────────────────────────────────────

export function uuid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Apply a theme by setting data-theme on <html>.
 * @param {'auto'|'dark'|'light'} theme
 */
export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Read the currently applied theme from the html element.
 * @returns {string}
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') ?? 'auto';
}

/**
 * Update the SVG logo gradient stop colors based on light/dark mode.
 * Targets stops with id "logo-stop-1" and "logo-stop-2".
 * @param {boolean} isLight
 */
export function updateLogoColors(isLight) {
  const stop1 = document.getElementById('logo-stop-1');
  const stop2 = document.getElementById('logo-stop-2');
  if (!stop1 || !stop2) return;
  if (isLight) {
    stop1.setAttribute('stop-color', '#7c3aed');
    stop2.setAttribute('stop-color', '#4f46e5');
  } else {
    stop1.setAttribute('stop-color', '#a78bfa');
    stop2.setAttribute('stop-color', '#818cf8');
  }
}

/**
 * Apply a custom theme object by setting individual CSS custom properties.
 * @param {Object} tokens — keys are CSS var names without '--', values are color strings
 *   Supported keys: bg, bgCard, bgTopbar, accent, textPrimary, textSecondary, textTertiary
 */
export function applyCustomTheme(tokens) {
  if (!tokens) return;
  const root = document.documentElement;
  const map = {
    bg:            '--bg',
    bgCard:        '--bg-card',
    bgTopbar:      '--bg-topbar',
    accent:        '--accent',
    textPrimary:   '--text-primary',
    textSecondary: '--text-secondary',
    textTertiary:  '--text-tertiary',
  };
  for (const [key, cssVar] of Object.entries(map)) {
    if (tokens[key]) root.style.setProperty(cssVar, tokens[key]);
  }
}

/**
 * Clear any inline custom theme overrides.
 */
export function clearCustomTheme() {
  const root = document.documentElement;
  ['--bg','--bg-card','--bg-topbar','--accent','--text-primary','--text-secondary','--text-tertiary']
    .forEach(v => root.style.removeProperty(v));
}

/**
 * Watch for OS-level color scheme changes.
 * @param {(isLight: boolean) => void} callback
 */
export function watchSystemTheme(callback) {
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  mq.addEventListener('change', e => callback(e.matches));
  // fire immediately with current state
  callback(mq.matches);
}

/**
 * Determine if the effective rendered theme is currently "light".
 * Accounts for auto mode resolving via prefers-color-scheme.
 * @returns {boolean}
 */
export function isEffectivelyLight() {
  const theme = getCurrentTheme();
  if (theme === 'light') return true;
  if (theme === 'dark') return false;
  return window.matchMedia('(prefers-color-scheme: light)').matches;
}
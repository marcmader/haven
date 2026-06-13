import { LANGS } from './i18n.js';
import { loadSettings, saveSettings } from './storage.js';

// WMO Weather Interpretation Codes → emoji + description
const WMO = {
  0:  { emoji: '☀️',  de: 'Klar',          en: 'Clear sky' },
  1:  { emoji: '🌤',  de: 'Überwiegend klar', en: 'Mainly clear' },
  2:  { emoji: '⛅',  de: 'Teilweise bewölkt', en: 'Partly cloudy' },
  3:  { emoji: '☁️',  de: 'Bedeckt',        en: 'Overcast' },
  45: { emoji: '🌫',  de: 'Nebel',          en: 'Fog' },
  48: { emoji: '🌫',  de: 'Reifnebel',      en: 'Rime fog' },
  51: { emoji: '🌦',  de: 'Leichter Niesel', en: 'Light drizzle' },
  53: { emoji: '🌦',  de: 'Mäßiger Niesel', en: 'Drizzle' },
  55: { emoji: '🌧',  de: 'Starker Niesel', en: 'Dense drizzle' },
  61: { emoji: '🌧',  de: 'Leichter Regen', en: 'Slight rain' },
  63: { emoji: '🌧',  de: 'Mäßiger Regen',  en: 'Moderate rain' },
  65: { emoji: '🌧',  de: 'Starker Regen',  en: 'Heavy rain' },
  71: { emoji: '🌨',  de: 'Leichter Schnee', en: 'Slight snow' },
  73: { emoji: '❄️',  de: 'Mäßiger Schnee', en: 'Moderate snow' },
  75: { emoji: '❄️',  de: 'Starker Schnee', en: 'Heavy snow' },
  77: { emoji: '🌨',  de: 'Schneekörner',   en: 'Snow grains' },
  80: { emoji: '🌦',  de: 'Leichte Schauer', en: 'Slight showers' },
  81: { emoji: '🌧',  de: 'Mäßige Schauer', en: 'Moderate showers' },
  82: { emoji: '⛈',  de: 'Starke Schauer',  en: 'Heavy showers' },
  85: { emoji: '🌨',  de: 'Schneeschauer',  en: 'Snow showers' },
  86: { emoji: '❄️',  de: 'Starke Schneeschauer', en: 'Heavy snow showers' },
  95: { emoji: '⛈',  de: 'Gewitter',        en: 'Thunderstorm' },
  96: { emoji: '⛈',  de: 'Gewitter mit Hagel', en: 'Thunderstorm with hail' },
  99: { emoji: '⛈',  de: 'Schweres Gewitter', en: 'Heavy thunderstorm with hail' },
};

/**
 * Convert WMO code to emoji string.
 * @param {number} code
 * @returns {string}
 */
export function wmoToEmoji(code) {
  return WMO[code]?.emoji ?? '🌡';
}

/**
 * Get WMO description in the active language.
 * @param {number} code
 * @param {'de'|'en'|'fr'|'es'} lang
 * @returns {string}
 */
export function wmoToDesc(code, lang) {
  const entry = WMO[code];
  if (!entry) return '';
  // FR and ES fall back to EN for descriptions (not in WMO table)
  return entry[lang] ?? entry.en ?? '';
}

/** Promisify navigator.geolocation */
function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
      maximumAge: 300000, // 5 min cache
    });
  });
}

/**
 * Reverse geocode lat/lon → city name via Nominatim.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<string>}
 */
async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
  const json = await res.json();
  return (
    json.address?.city ||
    json.address?.town ||
    json.address?.village ||
    json.address?.county ||
    'Unknown'
  );
}

/**
 * Fetch weather from Open-Meteo.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<Object>}
 */
async function fetchWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current_weather=true` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=4` +
    `&timezone=auto`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  return res.json();
}

/**
 * Render current weather into DOM elements.
 */
function renderWeather(data, city, elements, lang) {
  const cw = data.current_weather;
  const code = cw.weathercode;
  elements.iconEl.textContent = wmoToEmoji(code);
  elements.tempEl.textContent = `${Math.round(cw.temperature)}°C`;
  elements.cityEl.textContent = city;
  elements.descEl.textContent = wmoToDesc(code, lang);
  renderForecast(data.daily, elements.forecastEl, lang);
}

/**
 * Render 3-day forecast pills (days 1–3, skipping today).
 */
function renderForecast(daily, forecastEl, lang) {
  forecastEl.innerHTML = '';
  const l = LANGS[lang] ?? LANGS.en;
  // daily arrays include today at index 0; show indices 1,2,3
  for (let i = 1; i <= 3; i++) {
    if (!daily.time[i]) break;
    const date = new Date(daily.time[i] + 'T12:00:00');
    const dayName = l.days[date.getDay()].slice(0, 2); // "Mo", "Di" etc.
    const emoji = wmoToEmoji(daily.weathercode[i]);
    const hi = Math.round(daily.temperature_2m_max[i]);
    const lo = Math.round(daily.temperature_2m_min[i]);

    const pill = document.createElement('span');
    pill.className = 'fc-pill';
    pill.innerHTML =
      `<span class="fc-day">${dayName}</span>` +
      `<span class="fc-icon">${emoji}</span>` +
      `<span class="fc-temp">${hi}°</span>` +
      `<span class="fc-low">/${lo}°</span>`;
    forecastEl.appendChild(pill);
  }
}

/** Geolocation + reverse geocode → { lat, lon, city } */
async function _geolocate() {
  const pos = await getPosition();
  const { latitude: lat, longitude: lon } = pos.coords;
  const city = await reverseGeocode(lat, lon);
  return { lat, lon, city };
}

/** Show loading placeholder in weather elements */
function _showLoading(elements) {
  elements.tempEl.textContent = '…';
  elements.cityEl.textContent = '';
  elements.descEl.textContent = '';
}

/** Show error state in weather elements */
function _showError(elements) {
  elements.iconEl.textContent = '📍';
  elements.tempEl.textContent = '--';
  elements.cityEl.textContent = 'Location unavailable';
  elements.descEl.textContent = '';
}

/**
 * Initialize weather on startup.
 * Uses stored location if available; otherwise requests geolocation once and saves it.
 * @param {{ iconEl, tempEl, cityEl, descEl, forecastEl: HTMLElement }} elements
 * @param {string} lang
 */
export async function initWeather(elements, lang) {
  _showLoading(elements);
  try {
    const settings = loadSettings();
    let loc = settings.location;
    if (!loc) {
      loc = await _geolocate();
      const fresh = loadSettings();
      fresh.location = loc;
      saveSettings(fresh);
    }
    const weatherData = await fetchWeather(loc.lat, loc.lon);
    renderWeather(weatherData, loc.city, elements, lang);
  } catch (err) {
    _showError(elements);
    console.warn('Haven weather error:', err.message);
  }
}

/**
 * Force fresh geolocation, persist to settings, re-render weather.
 * Called by the "Neu bestimmen" button in settings.
 * @param {{ iconEl, tempEl, cityEl, descEl, forecastEl: HTMLElement }} elements
 * @param {string} lang
 * @returns {Promise<string|null>} city name on success, null on failure
 */
export async function detectLocation(elements, lang) {
  _showLoading(elements);
  try {
    const loc = await _geolocate();
    const settings = loadSettings();
    settings.location = loc;
    saveSettings(settings);
    const weatherData = await fetchWeather(loc.lat, loc.lon);
    renderWeather(weatherData, loc.city, elements, lang);
    return loc.city;
  } catch (err) {
    _showError(elements);
    console.warn('Haven location error:', err.message);
    return null;
  }
}

/**
 * Start the 30-minute weather refresh interval.
 * Uses stored location — never re-requests geolocation.
 * @param {{ iconEl, tempEl, cityEl, descEl, forecastEl: HTMLElement }} elements
 * @param {string} lang
 * @returns {number}
 */
export function startWeatherRefresh(elements, lang) {
  return setInterval(() => initWeather(elements, lang), 30 * 60 * 1000);
}

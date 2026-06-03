# Haven

A personal browser start page with categorized links, live weather, a ticking clock, daily quotes, and a full settings modal — all in vanilla HTML/CSS/JS with no build step.

**Live:** https://marcmader.github.io/haven/

---

## Features

- **Categorized links** — organize bookmarks into named categories, displayed in a 6-column card grid with favicons (letter avatars as fallback)
- **Clock & weather** — live clock with localized date, current conditions + 3-day forecast via Open-Meteo (no API key required)
- **Quote of the day** — daily motivational quote from a curated set of 51 quotes, displayed in the topbar
- **Personalized greeting** — time-based greeting (morning/afternoon/evening/night) with optional name, centered in the topbar
- **Google search** — search field in the topbar, opens results in a new tab
- **Link statistics** — live count of total links, categories, and opens today
- **Dark / light / auto theme** — follows the OS setting by default, overridable in settings
- **Custom theme** — pick your own background, topbar, accent, and text colors
- **Multilingual** — DE, EN, FR, ES; auto-detected from browser language
- **Export / import** — full JSON backup and restore of all data
- **localStorage only** — no server, no account, no tracking

---

## Screenshots

> Open `https://marcmader.github.io/haven/` in your browser to see it live.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Language | Vanilla HTML/CSS/JS (ES Modules) |
| Styling | CSS Custom Properties (no framework) |
| Data | `localStorage` |
| Weather | [Open-Meteo API](https://open-meteo.com/) (free, no key) |
| Geocoding | [Nominatim](https://nominatim.org/) (OpenStreetMap) |
| Favicons | Google Favicon Service |
| Hosting | GitHub Pages |
| Build | None |

---

## File Structure

```
haven/
├── index.html          # Shell — topbar, hero card, modal
├── style.css           # Design system — all CSS custom properties + components
├── quotes.json         # 51 curated motivational quotes
└── js/
    ├── app.js          # Entry point — wires all modules
    ├── storage.js      # localStorage wrapper + data model
    ├── i18n.js         # Translations (DE/EN/FR/ES) + greeting/date formatting
    ├── theme.js        # Theme switching + CSS var updates + logo color sync
    ├── clock.js        # Live clock with i18n date
    ├── weather.js      # Open-Meteo + Nominatim + WMO emoji mapping
    ├── quotes.js       # Daily quote selection + render
    ├── links.js        # Category + link card rendering, favicon/avatar
    └── settings.js     # Settings modal interactions
```

---

## Data Model

All data lives in `localStorage` under these keys:

| Key | Contents |
|---|---|
| `haven_links` | `{ categories: [{ id, name, links: [{ id, url, name, description }] }] }` |
| `haven_settings` | `{ theme, lang, userName, linkTarget, customTheme }` |
| `haven_stats` | `{ date, openCount }` — resets daily |
| `haven_custom_theme` | Custom color token overrides (optional) |

---

## Settings

Open the ⚙ button in the top-right corner to access:

| Setting | Options |
|---|---|
| Language | 🇩🇪 Deutsch · 🇬🇧 English · 🇫🇷 Français · 🇪🇸 Español |
| Theme | Auto (OS) · Dark · Light |
| Custom theme | Background · Topbar · Accent · Text color pickers |
| Name | Used in the topbar greeting |
| Link behavior | New tab (`_blank`) or same window (`_self`) |
| Manage links | Delete individual links or entire categories |
| Add category | Name a new category |
| Add link | URL, name, description, target category |
| Export | Downloads `haven-backup-YYYY-MM-DD.json` |
| Import | Restores from a previously exported JSON file |

---

## Local Development

No build step required. Because the app uses ES Modules, you need a local HTTP server (browsers block module imports on `file://`):

```bash
cd haven
python3 -m http.server 3000
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Deployment

The app is deployed via GitHub Pages from the `master` branch, root path `/`.

To deploy your own fork:

1. Fork this repo
2. Go to **Settings → Pages → Source**: branch `master`, path `/`
3. Your instance will be live at `https://<your-username>.github.io/haven/`

---

## Set as Browser Homepage

| Browser | Steps |
|---|---|
| **Safari** | Preferences → General → Homepage → `https://marcmader.github.io/haven/` |
| **Chrome** | Settings → On startup → Open a specific page → same URL |
| **Firefox** | Preferences → Home → Custom URLs → same URL |

---

## APIs Used

### Open-Meteo
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Parameters: `current_weather=true`, `daily=weathercode,temperature_2m_max,temperature_2m_min`, `forecast_days=4`, `timezone=auto`
- No API key required, free to use

### Nominatim (OpenStreetMap)
- Endpoint: `https://nominatim.openstreetmap.org/reverse`
- Used for reverse geocoding (coordinates → city name)
- No API key required, free to use
- Usage policy: one request per weather refresh (every 30 min)

### Google Favicon Service
- URL pattern: `https://www.google.com/s2/favicons?domain=<hostname>&sz=64`
- Falls back to letter avatar (colored square with first letter) if the favicon fails to load

---

## Privacy

- All personal data (links, settings, name) is stored exclusively in your browser's `localStorage`
- No data is sent to any server beyond the weather and favicon API calls
- Weather uses your geolocation (requested by the browser, only used for the API call)
- Geolocation coordinates are not stored

---

## License

MIT

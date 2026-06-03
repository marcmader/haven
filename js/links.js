// 8 color pairs [background, text] for letter avatars
const AVATAR_COLORS = [
  ['#7c3aed', '#fff'],
  ['#2563eb', '#fff'],
  ['#059669', '#fff'],
  ['#d97706', '#fff'],
  ['#dc2626', '#fff'],
  ['#db2777', '#fff'],
  ['#0891b2', '#fff'],
  ['#4f46e5', '#fff'],
];

/**
 * Pick a deterministic color pair from a link name.
 * @param {string} name
 * @returns {[string, string]} [bgColor, textColor]
 */
export function getAvatarColor(name) {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function _accentHex() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim().replace('#', '');
}

function _domainToSlug(hostname) {
  return hostname.replace(/^www\./, '').split('.')[0].toLowerCase();
}

/**
 * Create a favicon element using Simple Icons CDN, falling back to a letter avatar.
 * @param {string} url
 * @param {string} name
 * @param {string} [iconSlug] — explicit Simple Icons slug (e.g. "homeassistant")
 * @returns {HTMLElement}
 */
export function createFaviconEl(url, name, iconSlug) {
  const wrapper = document.createElement('span');
  wrapper.className = 'favicon-wrapper';

  let slug = iconSlug || null;

  if (!slug) {
    try {
      slug = _domainToSlug(new URL(url).hostname);
    } catch {
      wrapper.appendChild(createAvatarEl(name));
      return wrapper;
    }
  }

  const color = _accentHex();
  const siImg = document.createElement('img');
  siImg.className = 'favicon-img';
  siImg.src = `https://cdn.simpleicons.org/${slug}/${color}`;
  siImg.alt = name;
  siImg.width = 28;
  siImg.height = 28;

  siImg.onerror = () => siImg.replaceWith(createAvatarEl(name));
  wrapper.appendChild(siImg);
  return wrapper;
}

function createAvatarEl(name) {
  const [bg, color] = getAvatarColor(name);
  const span = document.createElement('span');
  span.className = 'avatar-letter';
  span.textContent = (name[0] || '?').toUpperCase();
  span.style.background = bg;
  span.style.color = color;
  return span;
}

/**
 * Create a single link card <a> element.
 * @param {{ id: string, url: string, name: string, description: string }} link
 * @param {{ linkTarget: string }} settings
 * @returns {HTMLAnchorElement}
 */
export function renderLinkCard(link, settings) {
  const a = document.createElement('a');
  a.className = 'link-card';
  a.href = link.url;
  a.target = settings.linkTarget || '_blank';
  if (settings.linkTarget === '_blank') a.rel = 'noopener noreferrer';

  const favicon = createFaviconEl(link.url, link.name, link.iconSlug);
  const info = document.createElement('div');
  info.className = 'link-info';

  const nameEl = document.createElement('span');
  nameEl.className = 'link-name';
  nameEl.textContent = link.name;
  info.appendChild(nameEl);

  if (link.description) {
    const descEl = document.createElement('span');
    descEl.className = 'link-desc';
    descEl.textContent = link.description;
    info.appendChild(descEl);
  }

  a.appendChild(favicon);
  a.appendChild(info);
  return a;
}

/**
 * Render all categories and their link cards into the container.
 * Clears existing category sections first (leaves hero-card intact).
 * @param {{ categories: Array }} data — from storage.loadLinks()
 * @param {{ linkTarget: string }} settings
 * @param {HTMLElement} container — the .content element
 */
export function renderCategories(data, settings, container) {
  container.querySelectorAll('.category').forEach(el => el.remove());

  for (const cat of data.categories) {
    const section = document.createElement('div');
    section.className = 'category';
    section.dataset.catId = cat.id;

    const label = document.createElement('div');
    label.className = 'cat-label';
    label.textContent = cat.name.toUpperCase();
    section.appendChild(label);

    const row = document.createElement('div');
    row.className = 'links-row';
    for (const link of cat.links) {
      row.appendChild(renderLinkCard(link, settings));
    }
    section.appendChild(row);
    container.appendChild(section);
  }
}

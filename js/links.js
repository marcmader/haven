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

/**
 * Create a favicon image element that falls back to a letter avatar on error.
 * @param {string} url — full URL of the link
 * @param {string} name — link name (used for avatar letter + color)
 * @returns {HTMLElement}
 */
export function createFaviconEl(url, name) {
  const wrapper = document.createElement('span');
  wrapper.className = 'favicon-wrapper';

  try {
    const domain = new URL(url).hostname;
    const img = document.createElement('img');
    img.className = 'favicon-img';
    img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    img.alt = name;
    img.width = 28;
    img.height = 28;
    img.onerror = () => {
      img.replaceWith(createAvatarEl(name));
    };
    wrapper.appendChild(img);
  } catch {
    // Invalid URL — go straight to avatar
    wrapper.appendChild(createAvatarEl(name));
  }

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

  const favicon = createFaviconEl(link.url, link.name);
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

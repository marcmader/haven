import { loadLinks, saveLinks } from './storage.js';

function _accentHex() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim().replace('#', '');
}

function _domainToSlug(hostname) {
  return hostname.replace(/^www\./, '').split('.')[0].toLowerCase();
}

// Active drag payload — shared across all drag handlers
let _drag = null;

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
  const span = document.createElement('span');
  span.className = 'avatar-letter';
  span.textContent = (name[0] || '?').toUpperCase();
  return span;
}

/**
 * Create a single link card <a> element.
 * @param {{ id, url, name, description, iconSlug }} link
 * @param {{ linkTarget: string }} settings
 * @param {string} catId
 * @param {Function} rerender
 * @returns {HTMLAnchorElement}
 */
export function renderLinkCard(link, settings, catId, rerender) {
  const a = document.createElement('a');
  a.className = 'link-card';
  a.href = link.url;
  a.target = settings.linkTarget || '_blank';
  if (settings.linkTarget === '_blank') a.rel = 'noopener noreferrer';
  a.draggable = true;

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

  // ── Link drag events ────────────────────────────────────────────────────
  a.addEventListener('dragstart', e => {
    e.stopPropagation();
    _drag = { type: 'link', linkId: link.id, catId };
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'link');
    requestAnimationFrame(() => a.classList.add('dragging'));
  });

  a.addEventListener('dragend', () => {
    a.classList.remove('dragging', 'drag-over');
    _drag = null;
  });

  a.addEventListener('dragover', e => {
    if (_drag?.type !== 'link' || _drag.linkId === link.id) return;
    e.preventDefault();
    e.stopPropagation();
    a.classList.add('drag-over');
  });

  a.addEventListener('dragleave', e => {
    if (!a.contains(e.relatedTarget)) a.classList.remove('drag-over');
  });

  a.addEventListener('drop', e => {
    a.classList.remove('drag-over');
    // Only handle link drops — let category drops bubble up to the section
    if (!_drag || _drag.type !== 'link' || _drag.linkId === link.id) return;
    e.preventDefault();
    e.stopPropagation();

    const data = loadLinks();
    const srcCat = data.categories.find(c => c.id === _drag.catId);
    const tgtCat = data.categories.find(c => c.id === catId);
    if (!srcCat || !tgtCat) return;

    const movedLink = srcCat.links.find(l => l.id === _drag.linkId);
    if (!movedLink) return;

    srcCat.links = srcCat.links.filter(l => l.id !== _drag.linkId);
    const tgtIdx = tgtCat.links.findIndex(l => l.id === link.id);
    tgtCat.links.splice(tgtIdx, 0, movedLink);

    saveLinks(data);
    rerender();
  });

  return a;
}

/**
 * Render all categories and their link cards into the container.
 * Supports drag & drop reordering of both categories and link cards.
 * @param {{ categories: Array }} data
 * @param {{ linkTarget: string }} settings
 * @param {HTMLElement} container
 */
export function renderCategories(data, settings, container) {
  container.querySelectorAll('.category').forEach(el => el.remove());

  const rerender = () => renderCategories(loadLinks(), settings, container);

  for (const cat of data.categories) {
    const section = document.createElement('div');
    section.className = 'category';
    section.dataset.catId = cat.id;
    section.draggable = true;

    const label = document.createElement('div');
    label.className = 'cat-label';
    label.textContent = cat.name.toUpperCase();
    section.appendChild(label);

    const row = document.createElement('div');
    row.className = 'links-row';
    for (const link of cat.links) {
      row.appendChild(renderLinkCard(link, settings, cat.id, rerender));
    }
    section.appendChild(row);
    container.appendChild(section);

    // ── Category drag events ──────────────────────────────────────────────
    section.addEventListener('dragstart', e => {
      if (_drag?.type === 'link') return;
      _drag = { type: 'cat', catId: cat.id };
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'cat');
      requestAnimationFrame(() => section.classList.add('dragging'));
    });

    section.addEventListener('dragend', () => {
      section.classList.remove('dragging', 'drag-over-cat');
      _drag = null;
    });

    section.addEventListener('dragover', e => {
      if (_drag?.type !== 'cat' || _drag.catId === cat.id) return;
      e.preventDefault();
      section.classList.add('drag-over-cat');
    });

    section.addEventListener('dragleave', e => {
      if (!section.contains(e.relatedTarget)) section.classList.remove('drag-over-cat');
    });

    section.addEventListener('drop', e => {
      section.classList.remove('drag-over-cat');
      if (!_drag || _drag.type !== 'cat' || _drag.catId === cat.id) return;
      e.preventDefault();

      const freshData = loadLinks();
      const fromIdx = freshData.categories.findIndex(c => c.id === _drag.catId);
      const toIdx   = freshData.categories.findIndex(c => c.id === cat.id);
      if (fromIdx === -1 || toIdx === -1) return;

      const [moved] = freshData.categories.splice(fromIdx, 1);
      freshData.categories.splice(toIdx, 0, moved);

      saveLinks(freshData);
      rerender();
    });

    // ── Drop into category row (including empty categories) ───────────────
    row.addEventListener('dragover', e => {
      if (_drag?.type !== 'link') return;
      e.preventDefault();
      e.stopPropagation();
      row.classList.add('drag-over-row');
    });

    row.addEventListener('dragleave', e => {
      if (!row.contains(e.relatedTarget)) row.classList.remove('drag-over-row');
    });

    row.addEventListener('drop', e => {
      row.classList.remove('drag-over-row');
      // Only handle link drops that didn't land on a specific card
      if (!_drag || _drag.type !== 'link') return;
      if (e.target instanceof Element && e.target.closest('.link-card')) return;
      e.preventDefault();
      e.stopPropagation();

      const freshData = loadLinks();
      const srcCat = freshData.categories.find(c => c.id === _drag.catId);
      const tgtCat = freshData.categories.find(c => c.id === cat.id);
      if (!srcCat || !tgtCat) return;

      const movedLink = srcCat.links.find(l => l.id === _drag.linkId);
      if (!movedLink) return;

      srcCat.links = srcCat.links.filter(l => l.id !== _drag.linkId);
      tgtCat.links.push(movedLink);

      saveLinks(freshData);
      rerender();
    });
  }
}

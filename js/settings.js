import { applyTheme, updateLogoColors, applyCustomTheme, clearCustomTheme, isEffectivelyLight } from './theme.js';
import { detectLang, getGreeting, t } from './i18n.js';
import { renderCategories } from './links.js';
import {
  loadSettings, saveSettings, loadLinks, saveLinks,
  loadStats, exportJSON, importJSON, uuid,
} from './storage.js';

/**
 * Initialize all settings modal interactions.
 * @param {{
 *   greetingEl: HTMLElement,
 *   statLinksEl: HTMLElement,
 *   statCatsEl: HTMLElement,
 *   statTodayEl: HTMLElement,
 *   categoriesContainer: HTMLElement,
 *   clockEl: HTMLElement,
 *   dateEl: HTMLElement,
 *   startClock: Function,
 * }} deps
 */
export function initSettings(deps) {
  const overlay = document.getElementById('modal');
  const modal = overlay?.querySelector('.modal');

  if (!overlay || !modal) return;

  // ── Tab switching ─────────────────────────────────────────────────────────

  modal.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      modal.querySelectorAll('.tab-panel').forEach(p => p.classList.add('tab-panel--hidden'));
      btn.classList.add('active');
      modal.querySelector(`.tab-panel[data-tab="${btn.dataset.tab}"]`)?.classList.remove('tab-panel--hidden');
    });
  });

  // ── Open / Close ──────────────────────────────────────────────────────────

  document.getElementById('settings-btn')?.addEventListener('click', () => {
    overlay.classList.add('open');
    _populateModal();
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('open');
  });

  // ── Language selector ─────────────────────────────────────────────────────

  modal.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      const settings = loadSettings();
      settings.lang = lang;
      saveSettings(settings);
      _refreshAfterLangChange(lang, deps);
      _highlightActive(modal, '[data-lang]', lang, 'data-lang');
    });
  });

  // ── Theme selector ────────────────────────────────────────────────────────

  modal.querySelectorAll('[data-theme-opt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeOpt;
      const settings = loadSettings();
      settings.theme = theme;
      settings.customTheme = null;
      saveSettings(settings);
      clearCustomTheme();
      applyTheme(theme);
      updateLogoColors(isEffectivelyLight());
      _highlightActive(modal, '[data-theme-opt]', theme, 'data-theme-opt');
    });
  });

  // ── Custom theme color inputs ─────────────────────────────────────────────

  modal.querySelectorAll('[data-token]').forEach(input => {
    input.addEventListener('input', () => {
      const settings = loadSettings();
      if (!settings.customTheme) settings.customTheme = {};
      settings.customTheme[input.dataset.token] = input.value;
      saveSettings(settings);
      applyCustomTheme(settings.customTheme);
    });
  });

  // ── User name input ───────────────────────────────────────────────────────

  const nameInput = modal.querySelector('#setting-name');
  nameInput?.addEventListener('input', () => {
    const settings = loadSettings();
    settings.userName = nameInput.value.trim();
    saveSettings(settings);
    const lang = detectLang(settings.lang);
    if (deps.greetingEl) {
      deps.greetingEl.innerHTML = _greetingHTML(lang, settings.userName);
    }
  });

  // ── Link target toggle ────────────────────────────────────────────────────

  modal.querySelectorAll('[data-target-opt]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.targetOpt;
      const settings = loadSettings();
      settings.linkTarget = target;
      saveSettings(settings);
      _highlightActive(modal, '[data-target-opt]', target, 'data-target-opt');
      // Re-render links with new target
      const data = loadLinks();
      renderCategories(data, settings, deps.categoriesContainer);
    });
  });

  // ── Add category ──────────────────────────────────────────────────────────

  modal.querySelector('#add-category-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const input = modal.querySelector('#input-cat-name');
    const name = input?.value.trim();
    if (!name) return;
    const data = loadLinks();
    data.categories.push({ id: uuid(), name, links: [] });
    saveLinks(data);
    input.value = '';
    const settings = loadSettings();
    renderCategories(data, settings, deps.categoriesContainer);
    _renderManageLinks(modal, data, settings, deps);
    _populateCategorySelect(modal, data);
  });

  // ── Add / Edit link form ──────────────────────────────────────────────────

  modal.querySelector('#cancel-edit-btn')?.addEventListener('click', () => {
    _exitEditMode(modal);
  });

  modal.querySelector('#add-link-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const form      = modal.querySelector('#add-link-form');
    const urlInput  = modal.querySelector('#input-url');
    const nameInput = modal.querySelector('#input-name');
    const descInput = modal.querySelector('#input-desc');
    const slugInput = modal.querySelector('#input-icon-slug');
    const catSelect = modal.querySelector('#input-cat');

    const url      = urlInput?.value.trim();
    const name     = nameInput?.value.trim();
    const desc     = descInput?.value.trim();
    const iconSlug = slugInput?.value.trim() || undefined;
    const catId    = catSelect?.value;

    if (!url || !name || !catId) return;

    const data        = loadLinks();
    const editLinkId  = form?.dataset.editLinkId;
    const editCatId   = form?.dataset.editCatId;

    if (editLinkId && editCatId) {
      const updatedLink = { id: editLinkId, url, name, description: desc, iconSlug };
      if (editCatId === catId) {
        const cat = data.categories.find(c => c.id === editCatId);
        if (cat) {
          const idx = cat.links.findIndex(l => l.id === editLinkId);
          if (idx !== -1) cat.links[idx] = updatedLink;
        }
      } else {
        const oldCat = data.categories.find(c => c.id === editCatId);
        if (oldCat) oldCat.links = oldCat.links.filter(l => l.id !== editLinkId);
        const newCat = data.categories.find(c => c.id === catId);
        if (newCat) newCat.links.push(updatedLink);
      }
      _exitEditMode(modal);
    } else {
      const cat = data.categories.find(c => c.id === catId);
      if (!cat) return;
      cat.links.push({ id: uuid(), url, name, description: desc, iconSlug });
      urlInput.value = '';
      nameInput.value = '';
      if (descInput) descInput.value = '';
      if (slugInput) slugInput.value = '';
    }

    saveLinks(data);
    const settings = loadSettings();
    renderCategories(data, settings, deps.categoriesContainer);
    _renderManageLinks(modal, data, settings, deps);
    _populateCategorySelect(modal, data);
  });

  // ── Edit link ─────────────────────────────────────────────────────────────

  modal.addEventListener('click', e => {
    const btn = e.target.closest('[data-edit-link]');
    if (!btn) return;
    const { catId, linkId } = btn.dataset;
    const data = loadLinks();
    const cat  = data.categories.find(c => c.id === catId);
    const link = cat?.links.find(l => l.id === linkId);
    if (!link) return;
    _populateCategorySelect(modal, data);
    _enterEditMode(modal, link, catId);
  });

  // ── Delete link ───────────────────────────────────────────────────────────

  modal.addEventListener('click', e => {
    const btn = e.target.closest('[data-delete-link]');
    if (!btn) return;
    const { catId, linkId } = btn.dataset;
    const data = loadLinks();
    const cat = data.categories.find(c => c.id === catId);
    if (!cat) return;
    cat.links = cat.links.filter(l => l.id !== linkId);
    saveLinks(data);
    const settings = loadSettings();
    renderCategories(data, settings, deps.categoriesContainer);
    _renderManageLinks(modal, data, settings, deps);
  });

  // ── Delete category ───────────────────────────────────────────────────────

  modal.addEventListener('click', e => {
    const btn = e.target.closest('[data-delete-cat]');
    if (!btn) return;
    const catId = btn.dataset.deleteCat;
    const data = loadLinks();
    data.categories = data.categories.filter(c => c.id !== catId);
    saveLinks(data);
    const settings = loadSettings();
    renderCategories(data, settings, deps.categoriesContainer);
    _renderManageLinks(modal, data, settings, deps);
    _populateCategorySelect(modal, data);
  });

  // ── Export ────────────────────────────────────────────────────────────────

  modal.querySelector('#export-btn')?.addEventListener('click', () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `haven-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // ── Import ────────────────────────────────────────────────────────────────

  const importInput = modal.querySelector('#import-file');
  modal.querySelector('#import-btn')?.addEventListener('click', () => {
    importInput?.click();
  });

  importInput?.addEventListener('change', () => {
    const file = importInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importJSON(reader.result);
        // Full re-render after import
        const settings = loadSettings();
        const lang = detectLang(settings.lang);
        applyTheme(settings.theme);
        if (settings.customTheme) applyCustomTheme(settings.customTheme);
        updateLogoColors(isEffectivelyLight());
        const data = loadLinks();
        renderCategories(data, settings, deps.categoriesContainer);
        if (deps.greetingEl) {
          deps.greetingEl.innerHTML = _greetingHTML(lang, settings.userName);
        }
        _populateModal();
        overlay.classList.remove('open');
      } catch (err) {
        alert('Import failed: ' + err.message);
      }
      importInput.value = '';
    };
    reader.readAsText(file);
  });

  // ── Public control ────────────────────────────────────────────────────────
  return {
    openToAddLink(catId) {
      _populateModal();
      modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      modal.querySelectorAll('.tab-panel').forEach(p => p.classList.add('tab-panel--hidden'));
      modal.querySelector('.tab-btn[data-tab="links"]')?.classList.add('active');
      modal.querySelector('.tab-panel[data-tab="links"]')?.classList.remove('tab-panel--hidden');
      if (catId) {
        const catSelect = modal.querySelector('#input-cat');
        if (catSelect) catSelect.value = catId;
      }
      overlay.classList.add('open');
    },
  };
}

// ── Private helpers ──────────────────────────────────────────────────────────

function _highlightActive(container, selector, value, attr) {
  container.querySelectorAll(selector).forEach(el => {
    el.classList.toggle('active', el.getAttribute(attr) === value);
  });
}

function _populateModal() {
  const modal = document.querySelector('.modal');
  if (!modal) return;
  const settings = loadSettings();
  const data = loadLinks();
  const lang = detectLang(settings.lang);

  // Highlight active options
  _highlightActive(modal, '[data-lang]', lang, 'data-lang');
  _highlightActive(modal, '[data-theme-opt]', settings.theme, 'data-theme-opt');
  _highlightActive(modal, '[data-target-opt]', settings.linkTarget, 'data-target-opt');

  // Fill name input
  const nameInput = modal.querySelector('#setting-name');
  if (nameInput) nameInput.value = settings.userName || '';

  // Fill custom theme color pickers
  if (settings.customTheme) {
    modal.querySelectorAll('[data-token]').forEach(input => {
      if (settings.customTheme[input.dataset.token]) {
        input.value = settings.customTheme[input.dataset.token];
      }
    });
  }

  _renderManageLinks(modal, data, settings, {});
  _populateCategorySelect(modal, data);
}

function _renderManageLinks(modal, data, settings, deps) {
  const container = modal.querySelector('#manage-links-list');
  if (!container) return;
  container.innerHTML = '';
  const lang = detectLang(settings.lang);

  for (const cat of data.categories) {
    const section = document.createElement('div');
    section.className = 'manage-cat';

    const header = document.createElement('div');
    header.className = 'manage-cat-header';
    const catTitle = document.createElement('strong');
    catTitle.textContent = cat.name;
    const delCatBtn = document.createElement('button');
    delCatBtn.className = 'delete-btn';
    delCatBtn.textContent = t(lang, 'deleteBtn');
    delCatBtn.dataset.deleteCat = cat.id;
    header.appendChild(catTitle);
    header.appendChild(delCatBtn);
    section.appendChild(header);

    for (const link of cat.links) {
      const row = document.createElement('div');
      row.className = 'link-row';
      const nameSpan = document.createElement('span');
      nameSpan.textContent = link.name;
      const editBtn = document.createElement('button');
      editBtn.className = 'edit-btn';
      editBtn.textContent = 'Bearbeiten';
      editBtn.dataset.editLink = '';
      editBtn.dataset.catId = cat.id;
      editBtn.dataset.linkId = link.id;
      const delBtn = document.createElement('button');
      delBtn.className = 'delete-btn';
      delBtn.textContent = t(lang, 'deleteBtn');
      delBtn.dataset.deleteLink = '';
      delBtn.dataset.catId = cat.id;
      delBtn.dataset.linkId = link.id;
      const btnGroup = document.createElement('div');
      btnGroup.className = 'link-btn-group';
      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(delBtn);
      row.appendChild(nameSpan);
      row.appendChild(btnGroup);
      section.appendChild(row);
    }

    container.appendChild(section);
  }
}

function _populateCategorySelect(modal, data) {
  const select = modal.querySelector('#input-cat');
  if (!select) return;
  select.innerHTML = '';
  for (const cat of data.categories) {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  }
}

function _refreshAfterLangChange(lang, deps) {
  if (deps.greetingEl) {
    const settings = loadSettings();
    deps.greetingEl.innerHTML = _greetingHTML(lang, settings.userName);
  }
  // Restart clock with new lang
  if (deps.clockEl && deps.dateEl && deps.startClock) {
    if (deps._clockId) clearInterval(deps._clockId);
    deps._clockId = deps.startClock({ clockEl: deps.clockEl, dateEl: deps.dateEl }, lang);
  }
}

function _greetingHTML(lang, userName) {
  const greeting = getGreeting(lang, '');
  if (userName) {
    return `${greeting}, <span class="greeting-name">${userName}</span>`;
  }
  return greeting;
}

function _enterEditMode(modal, link, catId) {
  const form      = modal.querySelector('#add-link-form');
  const submitBtn = modal.querySelector('#link-submit-btn');
  const cancelBtn = modal.querySelector('#cancel-edit-btn');
  if (!form) return;

  form.dataset.editLinkId = link.id;
  form.dataset.editCatId  = catId;

  const urlInput  = modal.querySelector('#input-url');
  const nameInput = modal.querySelector('#input-name');
  const descInput = modal.querySelector('#input-desc');
  const slugInput = modal.querySelector('#input-icon-slug');
  const catSelect = modal.querySelector('#input-cat');

  if (urlInput)  urlInput.value  = link.url;
  if (nameInput) nameInput.value = link.name;
  if (descInput) descInput.value = link.description || '';
  if (slugInput) slugInput.value = link.iconSlug || '';
  if (catSelect) catSelect.value = catId;
  if (submitBtn) submitBtn.textContent = 'Speichern';
  if (cancelBtn) cancelBtn.style.display = '';

  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function _exitEditMode(modal) {
  const form      = modal.querySelector('#add-link-form');
  const submitBtn = modal.querySelector('#link-submit-btn');
  const cancelBtn = modal.querySelector('#cancel-edit-btn');
  if (!form) return;

  delete form.dataset.editLinkId;
  delete form.dataset.editCatId;

  const urlInput  = modal.querySelector('#input-url');
  const nameInput = modal.querySelector('#input-name');
  const descInput = modal.querySelector('#input-desc');
  const slugInput = modal.querySelector('#input-icon-slug');

  if (urlInput)  urlInput.value  = '';
  if (nameInput) nameInput.value = '';
  if (descInput) descInput.value = '';
  if (slugInput) slugInput.value = '';
  if (submitBtn) submitBtn.textContent = 'Hinzufügen';
  if (cancelBtn) cancelBtn.style.display = 'none';
}

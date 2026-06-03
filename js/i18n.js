export const LANGS = {
  de: {
    days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
             'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    dateFormat(date) {
      return `${this.days[date.getDay()]}, ${date.getDate()}. ${this.months[date.getMonth()]} ${date.getFullYear()}`;
    },
    greetings: {
      morning:   'Guten Morgen',
      afternoon: 'Guten Tag',
      evening:   'Guten Abend',
      night:     'Gute Nacht',
    },
    ui: {
      linksLabel:      'Links',
      categoriesLabel: 'Kategorien',
      todayLabel:      'Heute',
      searchPlaceholder: 'Suchen…',
      settingsTitle:   'Einstellungen',
      languageSection: 'Sprache',
      themeSection:    'Erscheinungsbild',
      themeAuto:       'Auto',
      themeDark:       'Dunkel',
      themeLight:      'Hell',
      customThemeSection: 'Custom Theme',
      greetingSection: 'Begrüßung',
      namePlaceholder: 'Dein Name',
      linkTargetSection: 'Link-Verhalten',
      linkTargetBlank: 'Neues Tab',
      linkTargetSelf:  'Gleiches Fenster',
      manageLinksSection: 'Links verwalten',
      addCategorySection: 'Kategorie hinzufügen',
      addLinkSection:  'Neuen Link hinzufügen',
      dataSection:     'Daten',
      exportBtn:       'Export JSON',
      importBtn:       'Import JSON',
      addBtn:          'Hinzufügen',
      saveBtn:         'Speichern',
      deleteBtn:       'Löschen',
      urlPlaceholder:  'URL (https://…)',
      nameLinkPlaceholder: 'Name',
      descPlaceholder: 'Beschreibung (optional)',
      categoryPlaceholder: 'Kategorie',
      catNamePlaceholder: 'Kategoriename',
    },
  },

  en: {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months: ['January', 'February', 'March', 'April', 'May', 'June',
             'July', 'August', 'September', 'October', 'November', 'December'],
    dateFormat(date) {
      return `${this.days[date.getDay()]}, ${this.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    },
    greetings: {
      morning:   'Good Morning',
      afternoon: 'Good Afternoon',
      evening:   'Good Evening',
      night:     'Good Night',
    },
    ui: {
      linksLabel:      'Links',
      categoriesLabel: 'Categories',
      todayLabel:      'Today',
      searchPlaceholder: 'Search…',
      settingsTitle:   'Settings',
      languageSection: 'Language',
      themeSection:    'Appearance',
      themeAuto:       'Auto',
      themeDark:       'Dark',
      themeLight:      'Light',
      customThemeSection: 'Custom Theme',
      greetingSection: 'Greeting',
      namePlaceholder: 'Your name',
      linkTargetSection: 'Link Behaviour',
      linkTargetBlank: 'New Tab',
      linkTargetSelf:  'Same Window',
      manageLinksSection: 'Manage Links',
      addCategorySection: 'Add Category',
      addLinkSection:  'Add New Link',
      dataSection:     'Data',
      exportBtn:       'Export JSON',
      importBtn:       'Import JSON',
      addBtn:          'Add',
      saveBtn:         'Save',
      deleteBtn:       'Delete',
      urlPlaceholder:  'URL (https://…)',
      nameLinkPlaceholder: 'Name',
      descPlaceholder: 'Description (optional)',
      categoryPlaceholder: 'Category',
      catNamePlaceholder: 'Category name',
    },
  },

  fr: {
    days: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
             'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    dateFormat(date) {
      return `${this.days[date.getDay()]}, ${date.getDate()} ${this.months[date.getMonth()]} ${date.getFullYear()}`;
    },
    greetings: {
      morning:   'Bonjour',
      afternoon: 'Bon après-midi',
      evening:   'Bonsoir',
      night:     'Bonne nuit',
    },
    ui: {
      linksLabel:      'Liens',
      categoriesLabel: 'Catégories',
      todayLabel:      "Aujourd'hui",
      searchPlaceholder: 'Rechercher…',
      settingsTitle:   'Paramètres',
      languageSection: 'Langue',
      themeSection:    'Apparence',
      themeAuto:       'Auto',
      themeDark:       'Sombre',
      themeLight:      'Clair',
      customThemeSection: 'Thème personnalisé',
      greetingSection: 'Salutation',
      namePlaceholder: 'Votre nom',
      linkTargetSection: 'Comportement des liens',
      linkTargetBlank: 'Nouvel onglet',
      linkTargetSelf:  'Même fenêtre',
      manageLinksSection: 'Gérer les liens',
      addCategorySection: 'Ajouter une catégorie',
      addLinkSection:  'Ajouter un nouveau lien',
      dataSection:     'Données',
      exportBtn:       'Exporter JSON',
      importBtn:       'Importer JSON',
      addBtn:          'Ajouter',
      saveBtn:         'Enregistrer',
      deleteBtn:       'Supprimer',
      urlPlaceholder:  'URL (https://…)',
      nameLinkPlaceholder: 'Nom',
      descPlaceholder: 'Description (optionnel)',
      categoryPlaceholder: 'Catégorie',
      catNamePlaceholder: 'Nom de la catégorie',
    },
  },

  es: {
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
             'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    dateFormat(date) {
      return `${this.days[date.getDay()]}, ${date.getDate()} de ${this.months[date.getMonth()]} de ${date.getFullYear()}`;
    },
    greetings: {
      morning:   'Buenos días',
      afternoon: 'Buenas tardes',
      evening:   'Buenas tardes',
      night:     'Buenas noches',
    },
    ui: {
      linksLabel:      'Enlaces',
      categoriesLabel: 'Categorías',
      todayLabel:      'Hoy',
      searchPlaceholder: 'Buscar…',
      settingsTitle:   'Ajustes',
      languageSection: 'Idioma',
      themeSection:    'Apariencia',
      themeAuto:       'Auto',
      themeDark:       'Oscuro',
      themeLight:      'Claro',
      customThemeSection: 'Tema personalizado',
      greetingSection: 'Saludo',
      namePlaceholder: 'Tu nombre',
      linkTargetSection: 'Comportamiento de enlaces',
      linkTargetBlank: 'Nueva pestaña',
      linkTargetSelf:  'Misma ventana',
      manageLinksSection: 'Gestionar enlaces',
      addCategorySection: 'Añadir categoría',
      addLinkSection:  'Añadir nuevo enlace',
      dataSection:     'Datos',
      exportBtn:       'Exportar JSON',
      importBtn:       'Importar JSON',
      addBtn:          'Añadir',
      saveBtn:         'Guardar',
      deleteBtn:       'Eliminar',
      urlPlaceholder:  'URL (https://…)',
      nameLinkPlaceholder: 'Nombre',
      descPlaceholder: 'Descripción (opcional)',
      categoryPlaceholder: 'Categoría',
      catNamePlaceholder: 'Nombre de categoría',
    },
  },
};

/**
 * Detect language from saved setting or browser.
 * @param {string|null} savedLang — explicit override, or null for auto
 * @returns {'de'|'en'|'fr'|'es'}
 */
export function detectLang(savedLang) {
  if (savedLang && LANGS[savedLang]) return savedLang;
  const nav = navigator.language || '';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('fr')) return 'fr';
  if (nav.startsWith('es')) return 'es';
  return 'en';
}

/**
 * Get time-based greeting with optional name.
 * Boundaries: 5–11 morning, 12–17 afternoon, 18–21 evening, 22–4 night
 * @param {'de'|'en'|'fr'|'es'} lang
 * @param {string} userName
 * @returns {string}
 */
export function getGreeting(lang, userName) {
  const hour = new Date().getHours();
  let period;
  if (hour >= 5 && hour <= 11)  period = 'morning';
  else if (hour >= 12 && hour <= 17) period = 'afternoon';
  else if (hour >= 18 && hour <= 21) period = 'evening';
  else period = 'night';

  const base = LANGS[lang]?.greetings[period] ?? LANGS.en.greetings[period];
  return userName ? `${base}, ${userName}` : base;
}

/**
 * Format a Date for display in the given language.
 * @param {Date} date
 * @param {'de'|'en'|'fr'|'es'} lang
 * @returns {string}
 */
export function formatDate(date, lang) {
  const l = LANGS[lang] ?? LANGS.en;
  return l.dateFormat(date);
}

/**
 * Simple key lookup for UI strings with English fallback.
 * @param {'de'|'en'|'fr'|'es'} lang
 * @param {string} key
 * @returns {string}
 */
export function t(lang, key) {
  return LANGS[lang]?.ui[key] ?? LANGS.en.ui[key] ?? key;
}

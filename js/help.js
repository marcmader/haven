const HELP_CONTENT = {
  de: {
    title: 'Hilfe',
    sections: [
      {
        heading: 'Links & Kategorien',
        items: [
          { term: 'Link öffnen',            desc: 'Klick auf eine Kachel öffnet den Link. Das Verhalten (neues Tab oder gleiches Fenster) ist in den Einstellungen konfigurierbar.' },
          { term: 'Kategorie hinzufügen',   desc: 'Im Edit-Modus (✎) direkt über den „+ Kategorie"-Button auf der Hauptseite, oder über Einstellungen (⚙) → Tab „Links" → Kategorie hinzufügen.' },
          { term: 'Link hinzufügen',        desc: 'Im Edit-Modus (✎) über die „+"-Kachel am Ende einer Kategoriezeile, oder über Einstellungen → Tab „Links" → Neuen Link hinzufügen. Felder: URL, Name, Beschreibung (optional), Icon Slug (optional), Kategorie.' },
          { term: 'Link bearbeiten',        desc: 'Einstellungen → Tab „Links" → in der Linkliste auf „Bearbeiten" klicken. Kategorienwechsel ist dabei möglich.' },
          { term: 'Link / Kategorie löschen', desc: 'Einstellungen → Tab „Links" → Löschen-Button neben dem jeweiligen Eintrag.' },
        ],
      },
      {
        heading: 'Anordnung',
        items: [
          { term: 'Edit-Modus',             desc: 'Den ✎-Button in der Topbar aktivieren. Kategorien und Link-Kacheln können dann per Drag & Drop verschoben werden.' },
          { term: 'Kategorie verschieben',  desc: 'Im Edit-Modus am Kategorietitel (⠿) ziehen und vor eine andere Kategorie ablegen.' },
          { term: 'Kachel verschieben',     desc: 'Im Edit-Modus eine Kachel auf eine andere oder in eine leere Kategorie ziehen.' },
        ],
      },
      {
        heading: 'Icons',
        items: [
          { term: 'Automatische Erkennung', desc: 'Der Domainname wird automatisch als Simple Icons Slug verwendet (z. B. github.com → github).' },
          { term: 'Manueller Slug',         desc: 'Für IP-Adressen oder unbekannte Dienste beim Hinzufügen/Bearbeiten einen Slug aus simpleicons.org eintragen (z. B. homeassistant, proxmox).' },
          { term: 'Fallback',               desc: 'Wird kein Icon gefunden, erscheint ein farbiger Buchstaben-Avatar.' },
        ],
      },
      {
        heading: 'Design & Einstellungen',
        items: [
          { term: 'Design',                 desc: 'Einstellungen → Allgemein → Dark, Light, Auto (folgt dem System) oder Custom. Im Custom-Modus sind 7 Farben frei einstellbar: Hintergrund, Topbar, Akzentfarbe, Akzent 2, Text, Sekundärtext, Tertiärtext. Wechsel zu Dark/Light/Auto stellt die jeweiligen Defaults wieder her.' },
          { term: 'Sprache',                desc: 'Einstellungen → Allgemein → Sprache. Die Begrüßung und Datumsanzeige passen sich automatisch an.' },
          { term: 'Begrüßung',              desc: 'Einstellungen → Allgemein → Name eintragen für eine personalisierte Begrüßung in der Topbar.' },
          { term: 'Suche',                  desc: 'Das Suchfeld in der Topbar öffnet eine Google-Suche in einem neuen Tab.' },
        ],
      },
      {
        heading: 'Daten & Backup',
        items: [
          { term: 'Datenspeicherung',       desc: 'Alle Daten (Links, Einstellungen) werden ausschließlich lokal im Browser (localStorage) gespeichert. Kein Server, kein Account.' },
          { term: 'Export',                 desc: 'Einstellungen → Daten → Export JSON speichert alle Links und Einstellungen als Datei.' },
          { term: 'Import',                 desc: 'Einstellungen → Daten → Import JSON stellt ein gespeichertes Backup wieder her.' },
        ],
      },
    ],
  },

  en: {
    title: 'Help',
    sections: [
      {
        heading: 'Links & Categories',
        items: [
          { term: 'Open a link',            desc: 'Click a card to open the link. The behavior (new tab or same window) can be configured in settings.' },
          { term: 'Add a category',         desc: 'In edit mode (✎), use the \"+ Category\" button directly on the main page, or via Settings (⚙) → Links tab → Add category.' },
          { term: 'Add a link',             desc: 'In edit mode (✎), click the \"+\" card at the end of any category row, or via Settings → Links tab → Add new link. Fields: URL, name, description (optional), icon slug (optional), category.' },
          { term: 'Edit a link',            desc: 'Settings → Links tab → click "Edit" next to the link. You can also move it to a different category.' },
          { term: 'Delete a link / category', desc: 'Settings → Links tab → click the delete button next to the entry.' },
        ],
      },
      {
        heading: 'Reordering',
        items: [
          { term: 'Edit mode',              desc: 'Activate the ✎ button in the topbar. Categories and link cards can then be reordered by drag & drop.' },
          { term: 'Move a category',        desc: 'In edit mode, drag the category title (⠿) and drop it before another category.' },
          { term: 'Move a card',            desc: 'In edit mode, drag a card onto another card or into an empty category.' },
        ],
      },
      {
        heading: 'Icons',
        items: [
          { term: 'Auto-detection',         desc: 'The domain name is used automatically as a Simple Icons slug (e.g. github.com → github).' },
          { term: 'Manual slug',            desc: 'For IP addresses or unknown services, enter a slug from simpleicons.org when adding or editing a link (e.g. homeassistant, proxmox).' },
          { term: 'Fallback',               desc: 'If no icon is found, a colored letter avatar is shown instead.' },
        ],
      },
      {
        heading: 'Design & Settings',
        items: [
          { term: 'Theme',                  desc: 'Settings → General → Dark, Light, Auto (follows system), or Custom. In Custom mode, 7 colors are freely adjustable: Background, Topbar, Accent, Accent 2, Text, Secondary text, Tertiary text. Switching to Dark/Light/Auto restores that theme\'s defaults.' },
          { term: 'Language',               desc: 'Settings → General → Language. The greeting and date display adapt automatically.' },
          { term: 'Greeting',               desc: 'Settings → General → enter your name for a personalized greeting in the topbar.' },
          { term: 'Search',                 desc: 'The search field in the topbar opens a Google search in a new tab.' },
        ],
      },
      {
        heading: 'Data & Backup',
        items: [
          { term: 'Data storage',           desc: 'All data (links, settings) is stored locally in the browser (localStorage) only. No server, no account.' },
          { term: 'Export',                 desc: 'Settings → Data → Export JSON saves all links and settings as a file.' },
          { term: 'Import',                 desc: 'Settings → Data → Import JSON restores a previously saved backup.' },
        ],
      },
    ],
  },

  fr: {
    title: 'Aide',
    sections: [
      {
        heading: 'Liens & Catégories',
        items: [
          { term: 'Ouvrir un lien',         desc: 'Cliquez sur une carte pour ouvrir le lien. Le comportement (nouvel onglet ou même fenêtre) est configurable dans les paramètres.' },
          { term: 'Ajouter une catégorie',  desc: 'En mode édition (✎), utilisez le bouton „+ Catégorie" directement sur la page principale, ou via Paramètres (⚙) → onglet „Liens" → Ajouter une catégorie.' },
          { term: 'Ajouter un lien',        desc: 'En mode édition (✎), cliquez sur la carte „+" à la fin d\'une rangée de catégorie, ou via Paramètres → onglet „Liens" → Ajouter un nouveau lien. Champs : URL, nom, description (optionnel), slug d\'icône (optionnel), catégorie.' },
          { term: 'Modifier un lien',       desc: 'Paramètres → onglet „Liens" → cliquer sur „Modifier". Le changement de catégorie est possible.' },
          { term: 'Supprimer',              desc: 'Paramètres → onglet „Liens" → bouton Supprimer à côté de l\'entrée.' },
        ],
      },
      {
        heading: 'Réorganisation',
        items: [
          { term: 'Mode édition',           desc: 'Activer le bouton ✎ dans la barre supérieure. Les catégories et les cartes peuvent ensuite être déplacées par glisser-déposer.' },
          { term: 'Déplacer une catégorie', desc: 'En mode édition, faites glisser le titre de la catégorie (⠿) et déposez-le devant une autre catégorie.' },
          { term: 'Déplacer une carte',     desc: 'En mode édition, faites glisser une carte sur une autre ou dans une catégorie vide.' },
        ],
      },
      {
        heading: 'Icônes',
        items: [
          { term: 'Détection automatique',  desc: 'Le nom de domaine est utilisé automatiquement comme slug Simple Icons (ex. github.com → github).' },
          { term: 'Slug manuel',            desc: 'Pour les adresses IP ou les services inconnus, entrez un slug depuis simpleicons.org (ex. homeassistant, proxmox).' },
          { term: 'Fallback',               desc: 'Si aucune icône n\'est trouvée, un avatar avec la première lettre est affiché.' },
        ],
      },
      {
        heading: 'Design & Paramètres',
        items: [
          { term: 'Thème',                  desc: 'Paramètres → Général → Sombre, Clair, Auto (suit le système) ou Custom. En mode Custom, 7 couleurs sont configurables : Arrière-plan, Barre supérieure, Couleur d\'accentuation, Accentuation 2, Texte, Texte secondaire, Texte tertiaire. Passer à Sombre/Clair/Auto restaure les valeurs par défaut du thème.' },
          { term: 'Langue',                 desc: 'Paramètres → Général → Langue. Le message d\'accueil et la date s\'adaptent automatiquement.' },
          { term: 'Message d\'accueil',     desc: 'Paramètres → Général → entrez votre nom pour un message d\'accueil personnalisé dans la barre supérieure.' },
          { term: 'Recherche',              desc: 'Le champ de recherche dans la barre supérieure ouvre une recherche Google dans un nouvel onglet.' },
        ],
      },
      {
        heading: 'Données & Sauvegarde',
        items: [
          { term: 'Stockage',               desc: 'Toutes les données (liens, paramètres) sont stockées localement dans le navigateur (localStorage). Aucun serveur, aucun compte.' },
          { term: 'Export',                 desc: 'Paramètres → Données → Export JSON enregistre tous les liens et paramètres dans un fichier.' },
          { term: 'Import',                 desc: 'Paramètres → Données → Import JSON restaure une sauvegarde précédemment enregistrée.' },
        ],
      },
    ],
  },

  es: {
    title: 'Ayuda',
    sections: [
      {
        heading: 'Enlaces & Categorías',
        items: [
          { term: 'Abrir un enlace',        desc: 'Haz clic en una tarjeta para abrir el enlace. El comportamiento (nueva pestaña o misma ventana) es configurable en ajustes.' },
          { term: 'Añadir categoría',       desc: 'En modo edición (✎), usa el botón „+ Categoría" directamente en la página principal, o mediante Ajustes (⚙) → pestaña „Enlaces" → Añadir categoría.' },
          { term: 'Añadir enlace',          desc: 'En modo edición (✎), haz clic en la tarjeta „+" al final de una fila de categoría, o mediante Ajustes → pestaña „Enlaces" → Añadir nuevo enlace. Campos: URL, nombre, descripción (opcional), slug de icono (opcional), categoría.' },
          { term: 'Editar enlace',          desc: 'Ajustes → pestaña „Enlaces" → clic en „Editar". También puedes cambiar la categoría.' },
          { term: 'Eliminar',               desc: 'Ajustes → pestaña „Enlaces" → botón eliminar junto a la entrada.' },
        ],
      },
      {
        heading: 'Reorganización',
        items: [
          { term: 'Modo edición',           desc: 'Activa el botón ✎ en la barra superior. Las categorías y tarjetas se pueden reordenar arrastrando y soltando.' },
          { term: 'Mover categoría',        desc: 'En modo edición, arrastra el título de la categoría (⠿) y suéltalo antes de otra categoría.' },
          { term: 'Mover tarjeta',          desc: 'En modo edición, arrastra una tarjeta sobre otra o a una categoría vacía.' },
        ],
      },
      {
        heading: 'Iconos',
        items: [
          { term: 'Detección automática',   desc: 'El nombre de dominio se usa automáticamente como slug de Simple Icons (ej. github.com → github).' },
          { term: 'Slug manual',            desc: 'Para IPs o servicios desconocidos, introduce un slug de simpleicons.org al añadir o editar (ej. homeassistant, proxmox).' },
          { term: 'Alternativa',            desc: 'Si no se encuentra icono, se muestra un avatar con la primera letra del nombre.' },
        ],
      },
      {
        heading: 'Diseño & Ajustes',
        items: [
          { term: 'Tema',                   desc: 'Ajustes → General → Oscuro, Claro, Auto (sigue el sistema) o Custom. En modo Custom se pueden configurar 7 colores: Fondo, Barra superior, Color de acento, Acento 2, Texto, Texto secundario, Texto terciario. Cambiar a Oscuro/Claro/Auto restaura los valores predeterminados de ese tema.' },
          { term: 'Idioma',                 desc: 'Ajustes → General → Idioma. El saludo y la fecha se adaptan automáticamente.' },
          { term: 'Saludo',                 desc: 'Ajustes → General → introduce tu nombre para un saludo personalizado en la barra superior.' },
          { term: 'Búsqueda',               desc: 'El campo de búsqueda en la barra superior abre una búsqueda de Google en una nueva pestaña.' },
        ],
      },
      {
        heading: 'Datos & Copia de seguridad',
        items: [
          { term: 'Almacenamiento',         desc: 'Todos los datos (enlaces, ajustes) se guardan localmente en el navegador (localStorage). Sin servidor, sin cuenta.' },
          { term: 'Exportar',               desc: 'Ajustes → Datos → Export JSON guarda todos los enlaces y ajustes en un archivo.' },
          { term: 'Importar',               desc: 'Ajustes → Datos → Import JSON restaura una copia de seguridad guardada anteriormente.' },
        ],
      },
    ],
  },
};

/**
 * Render help content into the help modal for the given language.
 * @param {string} lang
 */
export function renderHelp(lang) {
  const content = HELP_CONTENT[lang] ?? HELP_CONTENT.en;
  const modal = document.getElementById('help-modal');
  if (!modal) return;

  const titleEl = modal.querySelector('.help-title');
  if (titleEl) titleEl.textContent = content.title;

  const body = modal.querySelector('.help-body');
  if (!body) return;

  body.innerHTML = '';
  for (const section of content.sections) {
    const h = document.createElement('div');
    h.className = 'help-section';

    const heading = document.createElement('div');
    heading.className = 'help-section-title';
    heading.textContent = section.heading;
    h.appendChild(heading);

    const dl = document.createElement('dl');
    dl.className = 'help-list';
    for (const item of section.items) {
      const dt = document.createElement('dt');
      dt.textContent = item.term;
      const dd = document.createElement('dd');
      dd.textContent = item.desc;
      dl.appendChild(dt);
      dl.appendChild(dd);
    }
    h.appendChild(dl);
    body.appendChild(h);
  }
}

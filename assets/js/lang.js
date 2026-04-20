// =============================================================
//  lang.js — Lion X Taxi
//  Logika przełączania języka + przelicznik EUR/PLN
// =============================================================

// Aktualny język (domyślnie PL)
let currentLang = localStorage.getItem('lionx_lang') || 'pl';

// Kolejność języków w przełączniku
const LANG_ORDER = ['pl', 'en', 'de', 'fr', 'da', 'no', 'sv', 'uk'];

// Pobierz tłumaczenie dla aktualnego języka
function t(key) {
  const lang = TRANSLATIONS[currentLang];
  return lang && lang[key] !== undefined ? lang[key] : (TRANSLATIONS['pl'][key] || key);
}

// Czy aktualny język używa EUR?
function isEurMode() {
  return TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang].eur_mode;
}

// Przelicz PLN → waluta bieżącego języka
function formatPrice(pln) {
  if (isEurMode()) {
    const eur = Math.round(pln / EUR_RATE * 10) / 10;
    return `€${eur.toFixed(2).replace('.', ',')}`;
  }
  return `${Math.round(pln)} zł`;
}

// Przelicz PLN → waluta, bez zaokrąglania (dla małych kwot)
function formatPriceExact(pln) {
  if (isEurMode()) {
    const eur = pln / EUR_RATE;
    return `€${eur.toFixed(2).replace('.', ',')}`;
  }
  return `${pln} zł`;
}

// Zastosuj tłumaczenia do wszystkich elementów z data-i18n
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });

  // Atrybuty placeholder osobno
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  // Opcje select (liczba osób)
  const personsSelect = document.getElementById('bf-persons');
  if (personsSelect) {
    const keys = ['person_1','person_2','person_3','person_4','person_5','person_6','person_7','person_8'];
    Array.from(personsSelect.options).forEach((opt, i) => {
      if (keys[i]) opt.textContent = t(keys[i]);
    });
  }

  // Aktualizuj przełącznik języka
  updateLangSwitcher();

  // Odśwież otwarte panele jeśli są
  refreshOpenPanels();
}

// Zmień język
function setLang(code) {
  if (!TRANSLATIONS[code]) return;
  currentLang = code;
  localStorage.setItem('lionx_lang', code);
  applyTranslations();

  // Zamknij dropdown
  const dropdown = document.getElementById('lang-dropdown');
  const btn = document.getElementById('lang-current');
  if (dropdown) dropdown.classList.remove('open');
  if (btn) btn.classList.remove('open');
}

// Aktualizuj wygląd przełącznika
function updateLangSwitcher() {
  const btn = document.getElementById('lang-current');
  if (!btn) return;
  const lang = TRANSLATIONS[currentLang];
  const displayCode = lang.lang_code || currentLang.toUpperCase();
  btn.innerHTML = `<span class="lang-code">${displayCode}</span><svg class="lang-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>`;
}

// Odśwież zawartość otwartego panelu
function refreshOpenPanels() {
  const openPanel = document.querySelector('.panel.active');
  if (!openPanel) return;
  const id = openPanel.id;
  if (id === 'panel-uslugi')    renderUslugi();
  if (id === 'panel-cennik')    renderCennik();
  if (id === 'panel-wycieczki') renderWycieczki();
  if (id === 'panel-kontakt')   renderKontakt();
}

// Zbuduj dropdown z językami
function buildLangSwitcher() {
  const list = document.getElementById('lang-list');
  if (!list) return;
  list.innerHTML = '';
  LANG_ORDER.forEach(code => {
    const lang = TRANSLATIONS[code];
    const item = document.createElement('button');
    item.className = 'lang-item' + (code === currentLang ? ' active' : '');
    item.innerHTML = `<span class="lang-flag">${lang.lang_flag}</span><span class="lang-name">${lang.lang_name}</span>`;
    // (no lang-code span in dropdown — codes removed per design)
    item.onclick = () => setLang(code);
    list.appendChild(item);
  });
}

// Toggle dropdown
function toggleLangDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  const btn = document.getElementById('lang-current');
  if (dropdown) {
    dropdown.classList.toggle('open');
    if (btn) btn.classList.toggle('open', dropdown.classList.contains('open'));
  }
}

// Zamknij dropdown po kliknięciu poza nim
document.addEventListener('click', (e) => {
  const switcher = document.getElementById('lang-switcher');
  if (switcher && !switcher.contains(e.target)) {
    const dropdown = document.getElementById('lang-dropdown');
    const btn = document.getElementById('lang-current');
    if (dropdown) dropdown.classList.remove('open');
    if (btn) btn.classList.remove('open');
  }
});

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
  buildLangSwitcher();
  applyTranslations();
});
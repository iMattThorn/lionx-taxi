// main.js — panele, autouzupełnianie, formularz rezerwacji
// ================================================================

let currentPanel = null;

function openPanel(name) {
  if (currentPanel) closePanel(false);
  const panel   = document.getElementById('panel-' + name);
  const overlay = document.getElementById('overlay');
  if (!panel) return;
  panel.classList.add('open');
  overlay.classList.add('show');
  currentPanel = name;
  document.body.style.overflow = 'hidden';

  // Renderuj zawartość panelu przez funkcje render* (obsługa języków)
  if (name === 'uslugi'    && typeof renderUslugi    === 'function') renderUslugi();
  if (name === 'cennik'    && typeof renderCennik    === 'function') renderCennik();
  if (name === 'wycieczki' && typeof renderWycieczki === 'function') renderWycieczki();
  if (name === 'kontakt'   && typeof renderKontakt   === 'function') renderKontakt();

  if (name === 'cennik' && typeof initAutocomplete === 'function') {
    setTimeout(initAutocomplete, 50);
  }
}

function closePanel(resetOverlay = true) {
  if (!currentPanel) return;
  const panel = document.getElementById('panel-' + currentPanel);
  if (panel) panel.classList.remove('open');
  if (resetOverlay) {
    document.getElementById('overlay').classList.remove('show');
    currentPanel = null;
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeBookingModal();
    closePanel();
  }
});

// ── AUTOUZUPEŁNIANIE (cennik) ────────────────────────────────
function initAutocomplete() {
  setupAC('c-from', 'ac-from');
  setupAC('c-to',   'ac-to');
}

// ── AUTOUZUPEŁNIANIE (formularz rezerwacji) ──────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupAC('bf-from', 'ac-bf-from');
  setupAC('bf-to',   'ac-bf-to');

  // Ustaw domyślną datę na dziś
  const dateInput = document.getElementById('bf-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }
});

function setupAC(inputId, listId) {
  const input = document.getElementById(inputId);
  const list  = document.getElementById(listId);
  if (!input || !list) return;

  const newInput = input.cloneNode(true);
  input.parentNode.replaceChild(newInput, input);

  newInput.addEventListener('input', () => {
    const q = newInput.value.trim().toLowerCase();
    list.innerHTML = '';
    if (q.length < 1) { list.classList.remove('open'); return; }

    const matches = Object.keys(COORDS)
      .filter(c => c.toLowerCase().startsWith(q))
      .slice(0, 8);

    if (!matches.length) { list.classList.remove('open'); return; }

    matches.forEach(city => {
      const item = document.createElement('div');
      item.className = 'ac-item';
      item.textContent = city;
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        newInput.value = city;
        list.classList.remove('open');
      });
      list.appendChild(item);
    });
    list.classList.add('open');
  });

  newInput.addEventListener('blur', () => {
    setTimeout(() => list.classList.remove('open'), 150);
  });
}

// ── FORMULARZ REZERWACJI ─────────────────────────────────────
function submitBooking() {
  const from    = document.getElementById('bf-from').value.trim();
  const to      = document.getElementById('bf-to').value.trim();
  const persons = document.getElementById('bf-persons').value;
  const date    = document.getElementById('bf-date').value;
  const time    = document.getElementById('bf-time').value;

  if (!from || !to) {
    if (!from) document.getElementById('bf-from').style.borderColor = '#e05555';
    if (!to)   document.getElementById('bf-to').style.borderColor   = '#e05555';
    setTimeout(() => {
      document.getElementById('bf-from').style.borderColor = '';
      document.getElementById('bf-to').style.borderColor   = '';
    }, 2000);
    return;
  }

  // Formatuj datę
  let dateStr = '';
  if (date) {
    const d = new Date(date);
    const locale = currentLang === 'pl' ? 'pl-PL' :
                   currentLang === 'uk' ? 'uk-UA' :
                   currentLang === 'de' ? 'de-DE' :
                   currentLang === 'fr' ? 'fr-FR' :
                   currentLang === 'da' ? 'da-DK' :
                   currentLang === 'no' ? 'nb-NO' :
                   currentLang === 'sv' ? 'sv-SE' : 'en-GB';
    dateStr = d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  }

  const personsNum = parseInt(persons);
  let personsStr;
  if (typeof t === 'function') {
    personsStr = `${persons} ${t(personsNum === 1 ? 'person_1' : personsNum < 5 ? 'person_2' : 'person_5').replace(/^\d+\s*/, '')}`;
  } else {
    personsStr = `${persons} ${personsNum === 1 ? 'osoba' : personsNum < 5 ? 'osoby' : 'osób'}`;
  }

  const summary = document.getElementById('booking-summary');
  summary.innerHTML =
    `<strong style="color:#f0ede6;display:block;margin-bottom:8px;">
      ${from} → ${to}
    </strong>
    ${personsStr}
    ${dateStr ? '· ' + dateStr : ''}
    ${time ? '· ' + time : ''}
    <br><br>${typeof t === 'function' ? t('modal_desc') : 'Zadzwoń pod jeden z numerów, aby potwierdzić przejazd.'}`;

  const modal = document.getElementById('booking-modal');
  modal.classList.add('show');
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) modal.classList.remove('show');
}

// Klik w tło modala zamyka go
document.addEventListener('click', e => {
  const modal = document.getElementById('booking-modal');
  if (modal && e.target === modal) closeBookingModal();
});
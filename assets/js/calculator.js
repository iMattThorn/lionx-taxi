// =============================================================
//  calculator.js — Logika kalkulatora cen Lion X Taxi
//  Wymaga: cities.js + lang.js (załadowanych wcześniej)
// =============================================================

const TROJMIASTO_CITIES = ['Gdańsk', 'Gdynia', 'Sopot', 'Lotnisko Rębiechowo (GDN)'];
const TARIFF_1 = { nameKey: 'tariff_1_name', base: 8, km: 4.00 };
const TARIFF_2 = { nameKey: 'tariff_2_name', base: 8, km: 5.80 };

// ── AUTOUZUPEŁNIANIE (cennik) ─────────────────────────────────
function initAutocomplete() {
  setupAutocomplete('c-from', 'ac-from');
  setupAutocomplete('c-to',   'ac-to');
}

function setupAutocomplete(inputId, listId) {
  const input = document.getElementById(inputId);
  const list  = document.getElementById(listId);
  if (!input || !list) return;

  const newInput = input.cloneNode(true);
  input.parentNode.replaceChild(newInput, input);

  let activeIndex = -1;

  newInput.addEventListener('input', () => {
    const val = newInput.value.toLowerCase().trim();
    list.innerHTML = '';
    if (val.length < 1) { list.classList.remove('open'); return; }

    const matches = CITY_NAMES.filter(c => c.toLowerCase().includes(val)).slice(0, 10);
    if (!matches.length) { list.classList.remove('open'); return; }

    matches.forEach(c => {
      const item = document.createElement('div');
      item.className = 'ac-item';
      item.textContent = c;
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        newInput.value = c;
        list.classList.remove('open');
      });
      list.appendChild(item);
    });
    list.classList.add('open');
    activeIndex = -1;
  });

  newInput.addEventListener('keydown', e => {
    const items = list.querySelectorAll('.ac-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, items.length - 1); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); }
    if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      newInput.value = items[activeIndex].textContent;
      list.classList.remove('open');
    }
    items.forEach((it, i) => it.classList.toggle('active', i === activeIndex));
  });

  newInput.addEventListener('blur', () => {
    setTimeout(() => list.classList.remove('open'), 150);
  });
}

// ── OBLICZANIE CENY ───────────────────────────────────────────
function calcPrice() {
  const fromEl = document.getElementById('c-from');
  const toEl   = document.getElementById('c-to');
  if (!fromEl || !toEl) return;

  const fromName = fromEl.value.trim();
  const toName   = toEl.value.trim();
  const pass     = parseInt(document.getElementById('c-pass').value) || 1;
  const extra    = document.getElementById('c-extra').value;
  const timeMode = document.getElementById('c-time') ? document.getElementById('c-time').value : 'day';

  const fromKey = CITY_NAMES.find(c => c.toLowerCase() === fromName.toLowerCase());
  const toKey   = CITY_NAMES.find(c => c.toLowerCase() === toName.toLowerCase());

  if (!fromKey || !toKey) {
    if (!fromKey && fromEl) fromEl.style.borderColor = '#e05555';
    if (!toKey   && toEl)   toEl.style.borderColor   = '#e05555';
    setTimeout(() => {
      if (fromEl) fromEl.style.borderColor = '';
      if (toEl)   toEl.style.borderColor   = '';
    }, 2000);
    return;
  }
  if (fromKey === toKey) {
    fromEl.style.borderColor = '#e05555';
    toEl.style.borderColor   = '#e05555';
    setTimeout(() => {
      fromEl.style.borderColor = '';
      toEl.style.borderColor   = '';
    }, 2000);
    return;
  }

  const dist = getTaxiDistance(fromKey, toKey);
  if (dist === null) {
    alert(typeof t === 'function' ? t('calc_error') : 'Nie udało się obliczyć trasy.');
    return;
  }

  const approximate   = isDistanceApproximate(fromKey, toKey);
  const bothTrojmiasto = TROJMIASTO_CITIES.includes(fromKey) && TROJMIASTO_CITIES.includes(toKey);
  const tariff = bothTrojmiasto ? TARIFF_1 : TARIFF_2;
  const tariffName = typeof t === 'function' ? t(tariff.nameKey) : tariff.nameKey;

  // Ceny w PLN — konwersja na wyświetlanie przez formatPrice()
  let pricePLN = tariff.base + dist * tariff.km;
  let rows = '';

  rows += `<div><span>${typeof t === 'function' ? t('tariff_start_name') : 'Opłata startowa'}</span><span>${formatPrice(tariff.base)}</span></div>`;
  rows += `<div><span>${dist} km × ${tariff.km.toFixed(2)} zł/km</span><span>${formatPrice(dist * tariff.km)}</span></div>`;

  if (timeMode === 'night') {
    const surcharge = Math.round(pricePLN * 0.2);
    pricePLN *= 1.2;
    rows += `<div><span>${typeof t === 'function' ? t('surcharge_night') : 'Dopłata nocna (22–6)'}</span><span>+${formatPrice(surcharge)}</span></div>`;
  }

  if (pass >= 5) {
    const surcharge = Math.round(pricePLN * 0.2);
    pricePLN *= 1.2;
    rows += `<div><span>${typeof t === 'function' ? t('surcharge_van') : 'Dopłata van (5+ os.)'}</span><span>+${formatPrice(surcharge)}</span></div>`;
  }

  if (extra === 'pet')     { pricePLN += 15; rows += `<div><span>${typeof t === 'function' ? t('extra_pet')     : 'Zwierzę'}</span><span>+${formatPrice(15)}</span></div>`; }
  if (extra === 'luggage') { pricePLN += 10; rows += `<div><span>${typeof t === 'function' ? t('extra_luggage') : 'Duży bagaż'}</span><span>+${formatPrice(10)}</span></div>`; }
  if (extra === 'baby')    { pricePLN += 20; rows += `<div><span>${typeof t === 'function' ? t('extra_baby')    : 'Fotelik'}</span><span>+${formatPrice(20)}</span></div>`; }

  pricePLN = Math.round(pricePLN / 5) * 5;
  const totalLabel = typeof t === 'function' ? t('calc_total') : 'Razem (orientacyjnie)';
  rows += `<div><span><strong>${totalLabel}</strong></span><span><strong>${formatPrice(pricePLN)}</strong></span></div>`;

  document.getElementById('res-empty').style.display = 'none';
  const resData = document.getElementById('res-data');
  resData.style.display = 'flex';
  resData.style.flexDirection = 'column';
  resData.style.gap = '12px';

  const approxNote = approximate ? ` <span class="approx-note">(${typeof t === 'function' ? t('approx') : 'dystans przybliżony'})</span>` : '';
  document.getElementById('res-rt').innerHTML =
    `<strong>${fromKey} → ${toKey}</strong><br>${tariffName}${approxNote}`;
  document.getElementById('res-price').textContent = formatPrice(pricePLN);
  document.getElementById('res-dist').textContent  = `~${dist} km`;
  document.getElementById('res-bd').innerHTML = rows;
}

// ── WYPEŁNIANIE KALKULATORA Z KAFELKÓW WYCIECZEK ─────────────
function fillCalc(from, to) {
  openPanel('cennik');
  setTimeout(() => {
    const fromEl = document.getElementById('c-from');
    const toEl   = document.getElementById('c-to');
    if (fromEl) fromEl.value = from;
    if (toEl)   toEl.value   = to;
    setTimeout(() => calcPrice(), 300);
  }, 200);
}
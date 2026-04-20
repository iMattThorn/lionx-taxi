// panel-cennik.js — kalkulator cen (z obsługą języków i EUR)

function renderCennik() {
  const el = document.getElementById('content-cennik');
  if (!el) return;

  el.innerHTML = `
    <div class="calc-form" style="margin-bottom:16px">

      <div class="calc-row">
        <div class="calc-field ac-wrap">
          <label>${t('label_from')}</label>
          <input type="text" id="c-from" placeholder="${t('placeholder_from')}" autocomplete="off">
          <div class="ac-list" id="ac-from"></div>
        </div>
        <div class="calc-swap" onclick="swapCities()" title="Swap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
          </svg>
        </div>
        <div class="calc-field ac-wrap">
          <label>${t('label_to')}</label>
          <input type="text" id="c-to" placeholder="${t('placeholder_to')}" autocomplete="off">
          <div class="ac-list" id="ac-to"></div>
        </div>
      </div>

      <div class="calc-row">
        <div class="calc-field">
          <label>${t('label_persons')}</label>
          <select id="c-pass">
            <option value="1">${t('person_1')}</option>
            <option value="2">${t('person_2')}</option>
            <option value="3">${t('person_3')}</option>
            <option value="4" selected>${t('person_4')}</option>
            <option value="5">${t('person_5')}</option>
            <option value="6">${t('person_6')}</option>
            <option value="7">${t('person_7')}</option>
          </select>
        </div>
        <div class="calc-field">
          <label>${t('label_extras')}</label>
          <select id="c-extra">
            <option value="none">${t('extra_none')}</option>
            <option value="pet">${t('extra_pet')}</option>
            <option value="luggage">${t('extra_luggage')}</option>
            <option value="baby">${t('extra_baby')}</option>
          </select>
        </div>
        <div class="calc-field">
          <label>${t('label_daytime')}</label>
          <select id="c-time">
            <option value="day">${t('daytime_day')}</option>
            <option value="night">${t('daytime_night')}</option>
          </select>
        </div>
      </div>

      <button class="btn-main" onclick="calcPrice()" style="width:100%;margin-top:4px">
        ${t('btn_calculate')}
      </button>

    </div>

    <!-- Wynik -->
    <div class="calc-result" id="calc-result">
      <div class="result-empty" id="res-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".3">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <p>${t('calc_empty')}</p>
      </div>
      <div class="result-data" id="res-data" style="display:none">
        <div class="res-route" id="res-rt"></div>
        <div class="res-price-box">
          <div>
            <div class="res-price-label">${t('calc_est_price')}</div>
            <div class="res-price-val" id="res-price"></div>
          </div>
          <div class="res-dist-box">
            <div class="res-price-label">${t('calc_distance')}</div>
            <div class="res-dist-val" id="res-dist"></div>
          </div>
        </div>
        <div class="res-breakdown" id="res-bd"></div>
        <p class="res-disclaimer" style="margin-top:8px">${t('calc_disclaimer')}</p>
        <a href="tel:+48698018895" class="btn-main" style="display:block;text-align:center;margin-top:12px">
          ${t('btn_book')}
        </a>
      </div>
    </div>

    <div class="tariff-info" style="margin-top:16px">
      <div class="tariff-item"><strong>${t('tariff_1_name')}</strong><span>${t('tariff_1_desc')}</span></div>
      <div class="tariff-item"><strong>${t('tariff_2_name')}</strong><span>${t('tariff_2_desc')}</span></div>
      <div class="tariff-item"><strong>${t('tariff_start_name')}</strong><span>${t('tariff_start_desc')}</span></div>
    </div>
  `;

  if (typeof initAutocomplete === 'function') {
    setTimeout(initAutocomplete, 50);
  }
}

function swapCities() {
  const from = document.getElementById('c-from');
  const to   = document.getElementById('c-to');
  if (!from || !to) return;
  const tmp = from.value;
  from.value = to.value;
  to.value   = tmp;
}
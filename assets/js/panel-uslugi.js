// panel-uslugi.js — zawartość panelu Usługi (z obsługą języków)

function renderUslugi() {
  const el = document.getElementById('content-uslugi');
  if (!el) return;

  el.innerHTML = `
    <div class="services-grid">

      <div class="srv-item">
        <div class="srv-ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div class="srv-text">
          <h3>${t('svc_local_title')}</h3>
          <p>${t('svc_local_desc')}</p>
        </div>
      </div>

      <div class="srv-item">
        <div class="srv-ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12.1 19.79 19.79 0 0 1 1.06 3.47 2 2 0 0 1 3.05 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
          </svg>
        </div>
        <div class="srv-text">
          <h3>${t('svc_airport_title')}</h3>
          <p>${t('svc_airport_desc')}</p>
        </div>
      </div>

      <div class="srv-item">
        <div class="srv-ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </div>
        <div class="srv-text">
          <h3>${t('svc_national_title')}</h3>
          <p>${t('svc_national_desc')}</p>
        </div>
      </div>

      <div class="srv-item">
        <div class="srv-ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="srv-text">
          <h3>${t('svc_van_title')}</h3>
          <p>${t('svc_van_desc')}</p>
        </div>
      </div>

      <div class="srv-item">
        <div class="srv-ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div class="srv-text">
          <h3>${t('svc_night_title')}</h3>
          <p>${t('svc_night_desc')}</p>
        </div>
      </div>

      <div class="srv-item">
        <div class="srv-ico">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div class="srv-text">
          <h3>${t('svc_trips_title')}</h3>
          <p>${t('svc_trips_desc')}</p>
        </div>
      </div>

    </div>

    <div class="panel-cta">
      <a href="tel:+48698018895" class="btn-main">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12.1 19.79 19.79 0 0 1 1.06 3.47 2 2 0 0 1 3.05 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
        </svg>
        698 018 895
      </a>
    </div>
  `;
}

// Inicjalizacja — renderuj przy otwarciu panelu
document.addEventListener('DOMContentLoaded', () => {
  // Renderuj gdy panel zostanie otwarty (obsługiwane przez main.js + openPanel)
});
// panel-kontakt.js — zawartość panelu Kontakt (z obsługą języków)

function renderKontakt() {
  const el = document.getElementById('content-kontakt');
  if (!el) return;

  el.innerHTML = `
    <!-- Formularz — pełna szerokość -->
    <div class="contact-form-full">
      <h3>${t('contact_form_title')}</h3>

      <div class="cf-row">
        <div class="cf-field">
          <label>${t('contact_name')}</label>
          <input type="text" id="cf-name" placeholder="${t('contact_name_ph')}">
        </div>
        <div class="cf-field">
          <label>${t('contact_phone_email')}</label>
          <input type="text" id="cf-contact" placeholder="${t('contact_phone_email_ph')}">
        </div>
      </div>

      <div class="cf-field">
        <label>${t('contact_message')}</label>
        <textarea id="cf-msg" placeholder="${t('contact_message_ph')}"></textarea>
      </div>

      <button class="btn-main" onclick="submitContactForm()" style="width:100%">
        ${t('btn_send')}
      </button>

      <div class="cf-success" id="cf-success" style="display:none">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F5A623" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <p>${t('contact_success')}</p>
      </div>
    </div>

    <!-- Dane kontaktowe pod formularzem -->
    <div class="contact-chips">

      <a href="tel:+48698018895" class="contact-chip">
        <div class="contact-ico">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12.1 19.79 19.79 0 0 1 1.06 3.47 2 2 0 0 1 3.05 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
          </svg>
        </div>
        <div>
          <div class="contact-label">${t('contact_tel1')}</div>
          <div class="contact-value">698 018 895</div>
        </div>
      </a>

      <a href="tel:+48676767676" class="contact-chip">
        <div class="contact-ico">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12.1 19.79 19.79 0 0 1 1.06 3.47 2 2 0 0 1 3.05 1.25h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/>
          </svg>
        </div>
        <div>
          <div class="contact-label">${t('contact_tel2')}</div>
          <div class="contact-value">676 767 676</div>
        </div>
      </a>

      <div class="contact-chip">
        <div class="contact-ico">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div>
          <div class="contact-label">Email</div>
          <div class="contact-value" style="font-size:.88rem;color:#aaa">${t('contact_email_placeholder')}</div>
        </div>
      </div>

      <div class="contact-chip">
        <div class="contact-ico">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div>
          <div class="contact-label">${t('contact_availability')}</div>
          <div class="contact-value">24 / 7</div>
        </div>
      </div>

    </div>
  `;
}

function submitContactForm() {
  const name    = document.getElementById('cf-name').value.trim();
  const contact = document.getElementById('cf-contact').value.trim();
  if (!name || !contact) {
    if (!name)    document.getElementById('cf-name').style.borderColor    = '#e05555';
    if (!contact) document.getElementById('cf-contact').style.borderColor = '#e05555';
    setTimeout(() => {
      document.getElementById('cf-name').style.borderColor    = '';
      document.getElementById('cf-contact').style.borderColor = '';
    }, 2000);
    return;
  }
  document.querySelector('.contact-form-full h3').style.display = 'none';
  document.querySelectorAll('.cf-row, .cf-field, #content-kontakt .btn-main').forEach(el => el.style.display = 'none');
  document.getElementById('cf-success').style.display = 'flex';
}
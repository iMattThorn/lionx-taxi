// panel-wycieczki.js — zawartość panelu Wycieczki (z obsługą języków)

function renderWycieczki() {
  const el = document.getElementById('content-wycieczki');
  if (!el) return;

  // Ceny w PLN — formatPrice() przelicza na EUR jeśli potrzeba
  const destinations = [
    { key: 'malbork',    img: 'malbork.jpg',    badge_key: 'badge_unesco',   time: '~1h',    pricePLN: 340,  from: 'Gdańsk', to: 'Malbork'  },
    { key: 'hel',        img: 'hel.jpg',        badge_key: 'badge_beach',    time: '~1.5h',  pricePLN: 420,  from: 'Gdańsk', to: 'Hel'      },
    { key: 'torun',      img: 'torun.jpg',       badge_key: 'badge_unesco',   time: '~2h',    pricePLN: 850,  from: 'Gdańsk', to: 'Toruń'    },
    { key: 'kaszuby',   img: 'kaszuby.jpg',    badge_key: 'badge_nature',   time: '~45 min',pricePLN: 220,  from: 'Gdańsk', to: 'Kartuzy'  },
    { key: 'elblag',     img: 'kanal.jpg',      badge_key: 'badge_unique',   time: '~1h',    pricePLN: 280,  from: 'Gdańsk', to: 'Elbląg'   },
    { key: 'leba',       img: 'leba.jpg',       badge_key: 'badge_nature',   time: '~1.5h',  pricePLN: 560,  from: 'Gdańsk', to: 'Łeba'     },
    { key: 'stutthof',   img: 'stutthof.jpg',   badge_key: 'badge_history',  time: '~45 min',pricePLN: 200,  from: 'Gdańsk', to: 'Sztutowo' },
    { key: 'trojmiasto', img: 'trojmiasto.jpg', badge_key: 'badge_popular',  time: '4–6h',   pricePLN: 200,  from: 'Gdańsk', to: 'Sopot'    },
    { key: 'warszawa',   img: 'warszawa.jpg',   badge_key: 'badge_far',      time: '~3.5h',  pricePLN: 1700, from: 'Gdańsk', to: 'Warszawa' },
  ];

  const cards = destinations.map(d => `
    <div class="dest-card" onclick="openCennikWithRoute('${d.from}','${d.to}')">
      <div class="dest-img">
        <img src="assets/img/${d.img}" alt="${t('dest_' + d.key + '_name')}" loading="lazy">
        <span class="dest-badge">${t(d.badge_key)}</span>
      </div>
      <div class="dest-body">
        <h3>${t('dest_' + d.key + '_name')}</h3>
        <p>${t('dest_' + d.key + '_desc')}</p>
        <div class="dest-meta">
          <span>⏱ ${d.time}</span>
          <span class="dest-price">${t('from_price')} ${formatPrice(d.pricePLN)}</span>
        </div>
      </div>
    </div>
  `).join('');

  el.innerHTML = `
    <p class="panel-intro">${t('trips_intro')}</p>
    <div class="dest-grid">${cards}</div>
  `;
}

// Otwiera panel cennika z wypełnionymi polami
function openCennikWithRoute(from, to) {
  closePanel();
  setTimeout(() => {
    openPanel('cennik');
    setTimeout(() => {
      const fFrom = document.getElementById('c-from');
      const fTo   = document.getElementById('c-to');
      if (fFrom) fFrom.value = from;
      if (fTo)   fTo.value   = to;
      if (typeof calcPrice === 'function') calcPrice();
    }, 100);
  }, 300);
}
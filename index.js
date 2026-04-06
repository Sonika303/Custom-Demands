/* ================================
   CUSTOM DEMANDS — index.js
   ================================ */

/* ── COPY PREVENTION ── */
['copy','cut','paste','selectstart','contextmenu'].forEach(evt =>
  document.addEventListener(evt, e => e.preventDefault(), { passive: false })
);
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && ['c','x','u','a','s','p'].includes(e.key.toLowerCase()))
    e.preventDefault();
});

/* ══════════════════════════════
   STYLE CONFIG
   ══════════════════════════════ */
const STYLE_CFG = {
  kawaii:      { label: '🌸 Kawaii',       color: '#ff6b9d', bg: '#ff6b9d18' },
  chibi:       { label: '🥰 Chibi',        color: '#a855f7', bg: '#a855f718' },
  anime:       { label: '⚡ Anime',        color: '#f97316', bg: '#f9731618' },
  hellokitty:  { label: '🎀 Hello Kitty',  color: '#e8003a', bg: '#e8003a12' },
  harrypotter: { label: '🧙 Harry Potter', color: '#740001', bg: '#74000112' },
  anything:    { label: '✦ Custom',        color: '#059669', bg: '#05966918' },
  sticker:     { label: '✨ Sticker',      color: '#7c4dff', bg: '#7c4dff18' }
};

/* ══════════════════════════════
   STATE
   ══════════════════════════════ */
let activeFilter = 'all';
let searchQuery  = '';

/* ══════════════════════════════
   BUILD ONE CARD
   ══════════════════════════════ */
function buildCard(item, index) {
  const cfg   = STYLE_CFG[item.style] || STYLE_CFG.sticker;
  const delay = ((index % 5) * 0.05).toFixed(2) + 's';
  const num   = String(item.id).padStart(2, '0');

  const priceHTML = item.price != null
    ? `<div class="card-price">₹${item.price}</div>` : '';

  const imgHTML = item.image
    ? `<img src="${item.image}" alt="${item.name}" class="card-img" loading="lazy"
         onerror="this.outerHTML='<div class=\\'card-ph\\'><span class=\\'card-num\\'>${num}</span><p>Image Missing</p></div>'">`
    : `<div class="card-ph"><span class="card-num">${num}</span><p>Add Image</p></div>`;

  return `
    <article class="card" style="animation-delay:${delay}"
             data-name="${item.name.toLowerCase()}"
             data-desc="${item.desc.toLowerCase()}"
             data-style="${item.style}"
             itemscope itemtype="https://schema.org/Product">
      ${priceHTML}
      <div class="card-img-wrap">${imgHTML}</div>
      <div class="card-body">
        <span class="card-cat"
          style="color:${cfg.color};background:${cfg.bg};border:1px solid ${cfg.color}28">
          ${cfg.label}
        </span>
        <h3 class="card-name" itemprop="name">${item.name}</h3>
        <p  class="card-desc" itemprop="description">${item.desc}</p>
        <div class="card-btns">
          <a href="https://forms.gle/drrjRG7ptcdLWmaa8" target="_blank" rel="noopener"
             class="cbtn-order"
             style="background:${cfg.color};border-color:${cfg.color}">Order Now</a>
          <a href="https://forms.gle/drrjRG7ptcdLWmaa8" target="_blank" rel="noopener"
             class="cbtn-sec">Customise</a>
        </div>
      </div>
    </article>`;
}

/* ══════════════════════════════
   FILTER + SEARCH ENGINE
   ══════════════════════════════ */
function applyFilters() {
  const grid       = document.getElementById('stickerGrid');
  const emptyState = document.getElementById('emptyState');
  const countEl    = document.getElementById('resultsCount');
  if (!grid) return;

  const cards = grid.querySelectorAll('.card');
  let visible  = 0;

  cards.forEach(card => {
    const nameMatch  = card.dataset.name.includes(searchQuery);
    const descMatch  = card.dataset.desc.includes(searchQuery);
    const styleMatch = activeFilter === 'all' || card.dataset.style === activeFilter;
    const show       = (nameMatch || descMatch) && styleMatch;

    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  /* Update count */
  if (countEl) {
    if (searchQuery || activeFilter !== 'all') {
      countEl.textContent = `${visible} sticker${visible !== 1 ? 's' : ''} found`;
    } else {
      countEl.textContent = '';
    }
  }

  /* Empty state */
  if (emptyState) {
    emptyState.style.display = visible === 0 ? '' : 'none';
  }
}

/* ══════════════════════════════
   RENDER ALL CARDS
   ══════════════════════════════ */
function renderStickers() {
  const grid = document.getElementById('stickerGrid');
  if (!grid) return;

  if (typeof STICKERS === 'undefined' || !STICKERS.length) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px">No stickers found — check data/stickers.js is loaded.</p>';
    return;
  }

  grid.innerHTML = STICKERS.map((item, i) => buildCard(item, i)).join('');
}

/* ══════════════════════════════
   SEARCH INPUT LOGIC
   ══════════════════════════════ */
function initSearch() {
  const input     = document.getElementById('searchInput');
  const clearBtn  = document.getElementById('searchClear');
  if (!input) return;

  input.addEventListener('input', () => {
    searchQuery = input.value.trim().toLowerCase();
    clearBtn.style.display = searchQuery ? '' : 'none';
    applyFilters();
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    searchQuery = '';
    clearBtn.style.display = 'none';
    input.focus();
    applyFilters();
  });
}

/* ══════════════════════════════
   FILTER PILLS LOGIC
   ══════════════════════════════ */
function initFilters() {
  const pills = document.querySelectorAll('.fpill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      applyFilters();
    });
  });
}

/* ══════════════════════════════
   RESET (used by empty state button)
   ══════════════════════════════ */
function resetFilters() {
  activeFilter = 'all';
  searchQuery  = '';
  const input  = document.getElementById('searchInput');
  const clear  = document.getElementById('searchClear');
  const pills  = document.querySelectorAll('.fpill');
  if (input) input.value = '';
  if (clear) clear.style.display = 'none';
  pills.forEach(p => p.classList.toggle('active', p.dataset.filter === 'all'));
  applyFilters();
}
window.resetFilters = resetFilters;

/* ══════════════════════════════
   NAV INTERACTIONS
   ══════════════════════════════ */
function initNav() {
  const nav     = document.getElementById('mainNav');
  const ham     = document.getElementById('ham');
  const mobMenu = document.getElementById('mobMenu');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  if (ham && mobMenu) {
    ham.addEventListener('click', e => {
      e.stopPropagation();
      const open = mobMenu.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !mobMenu.contains(e.target)) closeMob();
    });
  }

  /* Smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        e.preventDefault();
        closeMob();
        window.scrollTo({ top: t.offsetTop - 74, behavior: 'smooth' });
      }
    });
  });
}

function closeMob() {
  const ham     = document.getElementById('ham');
  const mobMenu = document.getElementById('mobMenu');
  if (mobMenu) mobMenu.classList.remove('open');
  if (ham)     { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); }
}
window.closeMob = closeMob;

/* ══════════════════════════════
   BOOT
   ══════════════════════════════ */
function boot() {
  renderStickers();
  initSearch();
  initFilters();
  initNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
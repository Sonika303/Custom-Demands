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
   BUILD STICKER CARD
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
    <article class="card" style="animation-delay:${delay}" role="listitem"
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
   RENDER STICKERS
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
   FILTER + SEARCH
   ══════════════════════════════ */
function applyFilters() {
  const grid      = document.getElementById('stickerGrid');
  const emptyEl   = document.getElementById('emptyState');
  const countEl   = document.getElementById('resultsCount');
  if (!grid) return;

  let visible = 0;
  grid.querySelectorAll('.card').forEach(card => {
    const nameMatch  = card.dataset.name.includes(searchQuery);
    const descMatch  = card.dataset.desc.includes(searchQuery);
    const styleMatch = activeFilter === 'all' || card.dataset.style === activeFilter;
    const show       = (nameMatch || descMatch) && styleMatch;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  if (countEl) {
    countEl.textContent = (searchQuery || activeFilter !== 'all')
      ? `${visible} sticker${visible !== 1 ? 's' : ''} found` : '';
  }
  if (emptyEl) emptyEl.style.display = visible === 0 ? '' : 'none';
}

function resetFilters() {
  activeFilter = 'all';
  searchQuery  = '';
  const input = document.getElementById('searchInput');
  const clear = document.getElementById('searchClear');
  if (input) input.value = '';
  if (clear) clear.style.display = 'none';
  document.querySelectorAll('.fpill').forEach(p =>
    p.classList.toggle('active', p.dataset.filter === 'all')
  );
  applyFilters();
}
window.resetFilters = resetFilters;

function initSearch() {
  const input    = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
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

function initFilters() {
  document.querySelectorAll('.fpill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.fpill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      applyFilters();
    });
  });
}

/* ══════════════════════════════
   BUILD TESTIMONIAL CARD
   ══════════════════════════════ */
function buildTestimonialCard(t, i) {
  const cfg   = STYLE_CFG[t.style] || STYLE_CFG.sticker;
  const delay = ((i % 3) * 0.08).toFixed(2) + 's';
  const stars = '★'.repeat(Math.min(t.rating || 5, 5)) + '☆'.repeat(5 - Math.min(t.rating || 5, 5));
  const initials = (t.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const mediaHTML = (t.media && t.mediaType === 'image')
    ? `<div class="tcard-media">
         <img src="${t.media}" alt="${t.name}'s sticker" loading="lazy"
              onerror="this.parentElement.style.display='none'"/>
       </div>` : '';

  const handleHTML = t.handle
    ? `<span class="tcard-handle">${t.handle}</span>` : '';

  return `
    <div class="tcard" style="animation-delay:${delay}"
         itemscope itemtype="https://schema.org/Review">
      <div class="tcard-top">
        <svg class="tcard-quote" viewBox="0 0 40 30" fill="currentColor">
          <path d="M0 30V18C0 7.163 5.373 1.373 16.12 0l2.24 3.36C13.147 4.8 10.24 7.787 9.6 12.48H16V30H0zm22 0V18C22 7.163 27.373 1.373 38.12 0l2.24 3.36C35.147 4.8 32.24 7.787 31.6 12.48H38V30H22z"/>
        </svg>
        <div class="tcard-stars" aria-label="${t.rating || 5} out of 5 stars">${stars}</div>
      </div>
      <p class="tcard-text" itemprop="reviewBody">${t.text}</p>
      ${mediaHTML}
      <div class="tcard-footer">
        <div class="tcard-avatar" style="background:${cfg.color}">${initials}</div>
        <div class="tcard-info">
          <span class="tcard-name" itemprop="author">${t.name}</span>
          ${handleHTML}
          <span class="tcard-date">${t.date || ''}</span>
        </div>
        <span class="tcard-badge"
          style="color:${cfg.color};background:${cfg.bg};border:1px solid ${cfg.color}28">
          ${cfg.label}
        </span>
      </div>
    </div>`;
}

/* ══════════════════════════════
   RENDER TESTIMONIALS
   ══════════════════════════════ */
function renderTestimonials() {
  const grid  = document.getElementById('testimonialGrid');
  const empty = document.getElementById('testimonialEmpty');
  if (!grid) return;

  if (typeof TESTIMONIALS === 'undefined' || !TESTIMONIALS.length) {
    if (empty) empty.style.display = '';
    return;
  }
  grid.innerHTML = TESTIMONIALS.map((t, i) => buildTestimonialCard(t, i)).join('');
}

/* ══════════════════════════════
   NAV AUTH
   ══════════════════════════════ */
function initNavAuth() {
  const navUser     = document.getElementById('navUser');
  const navSignIn   = document.getElementById('navSignIn');
  const navAvatar   = document.getElementById('navAvatarCircle');
  const navUsername = document.getElementById('navUsernameText');
  const navLogout   = document.getElementById('navLogout');
  const mobSection  = document.getElementById('mobUserSection');

  if (!navUser || !navSignIn) return;

  // Small delay to let Firebase initialize
  try {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch username from DB
        let username = user.displayName || 'user';
        try {
          const snap = await firebase.database().ref('users/' + user.uid + '/username').once('value');
          if (snap.exists() && snap.val()) username = snap.val();
        } catch(e) { /* use displayName */ }

        const initials = username.slice(0, 2).toUpperCase();
        const photoURL  = user.photoURL;

        // Desktop nav
        if (navAvatar) {
          navAvatar.innerHTML = photoURL
            ? `<img src="${photoURL}" alt="${username}" referrerpolicy="no-referrer"/>`
            : initials;
        }
        if (navUsername) navUsername.textContent = '@' + username;
        navUser.style.display   = 'flex';
        navSignIn.style.display = 'none';

        // Mobile menu user section
        if (mobSection) {
          mobSection.innerHTML = `
            <div class="mob-user-row">
              <div class="mob-avatar">
                ${photoURL ? `<img src="${photoURL}" alt="${username}" referrerpolicy="no-referrer"/>` : initials}
              </div>
              <div class="mob-user-info">
                <div class="mob-user-name">@${username}</div>
                <div class="mob-user-sub">${user.email || ''}</div>
              </div>
              <a href="auth.html?settings" class="mob-settings-link" title="Settings" onclick="closeMob()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              </a>
              <button class="mob-logout-btn" id="mobLogoutBtn" title="Sign Out">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>`;

          document.getElementById('mobLogoutBtn')?.addEventListener('click', doNavSignOut);
        }

        // Desktop logout
        navLogout?.addEventListener('click', doNavSignOut);

      } else {
        navUser.style.display   = 'none';
        navSignIn.style.display = '';

        if (mobSection) {
          mobSection.innerHTML = `
            <div class="mob-signin-row">
              <a href="auth.html" onclick="closeMob()">Sign In to Your Account</a>
            </div>`;
        }
      }
    });
  } catch(e) {
    // Firebase not available — just show sign in
    navSignIn.style.display = '';
  }
}

async function doNavSignOut() {
  try {
    await firebase.auth().signOut();
    location.reload();
  } catch(e) { location.reload(); }
}

/* ══════════════════════════════
   NAV SCROLL + MOBILE
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

  // Smooth anchor scroll
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
  if (ham) { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); }
}
window.closeMob = closeMob;

/* ══════════════════════════════
   BOOT
   ══════════════════════════════ */
function boot() {
  renderStickers();
  renderTestimonials();
  initSearch();
  initFilters();
  initNav();
  initNavAuth();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
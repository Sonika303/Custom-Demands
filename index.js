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

/* ══════════════════════════════════════════
   STYLE CONFIG — one entry per style tag
   Add hellokitty for Hello Kitty stickers
   ══════════════════════════════════════════ */
const STYLE_CFG = {
  kawaii:     { label: '🌸 Kawaii',       color: '#ff6b9d', bg: '#ff6b9d18' },
  chibi:      { label: '🥰 Chibi',        color: '#a855f7', bg: '#a855f718' },
  anime:      { label: '⚡ Anime',        color: '#f97316', bg: '#f9731618' },
  hellokitty: { label: '🎀 Hello Kitty',  color: '#e8003a', bg: '#e8003a12' },
  anything:   { label: '✦ Custom',        color: '#059669', bg: '#05966918' },
  sticker:    { label: '✨ Sticker',      color: '#7c4dff', bg: '#7c4dff18' }
};

/* ══════════════════════════════════════════
   BUILD STICKER CARD HTML
   ══════════════════════════════════════════ */
function buildCard(item, index) {
  const cfg   = STYLE_CFG[item.style] || STYLE_CFG.sticker;
  const delay = ((index % 5) * 0.05).toFixed(2) + 's';
  const num   = String(item.id).padStart(2, '0');

  // Real image uses <img> with object-fit:contain (handled by CSS)
  // Placeholder shows numbered tile
  const imgHTML = item.image
    ? `<img src="${item.image}" alt="${item.name}" class="card-img" loading="lazy"
         onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'card-ph\\'><span class=\\'card-num\\'>${num}</span><p>Image Missing</p></div>')">`
    : `<div class="card-ph"><span class="card-num">${num}</span><p>Add Image</p></div>`;

  return `
    <article class="card" style="animation-delay:${delay}" itemscope itemtype="https://schema.org/Product">
      <div class="card-img-wrap">${imgHTML}</div>
      <div class="card-body">
        <span class="card-cat" style="color:${cfg.color};background:${cfg.bg};border:1px solid ${cfg.color}28">
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

/* ══════════════════════════════════════════
   BUILD REVIEW CARD HTML
   ══════════════════════════════════════════ */
const STYLE_LABELS = {
  kawaii:'🌸 Kawaii', chibi:'🥰 Chibi', anime:'⚡ Anime',
  hellokitty:'🎀 Hello Kitty', anything:'✦ Anything', sticker:'✨ Sticker'
};

function buildStars(n) {
  return [1,2,3,4,5].map(i =>
    `<svg width="14" height="14" viewBox="0 0 24 24"
        fill="${i <= n ? '#f0a500' : 'none'}" stroke="#f0a500" stroke-width="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>`
  ).join('');
}

function buildReview(item, index) {
  const delay   = ((index % 4) * 0.07).toFixed(2) + 's';
  const initial = (item.name || 'C').charAt(0).toUpperCase();

  let mediaHTML = '';
  if (item.media) {
    if (item.mediaType === 'video') {
      mediaHTML = `<div class="review-media">
        <video src="${item.media}" controls playsinline preload="metadata" class="review-video"></video>
      </div>`;
    } else {
      mediaHTML = `<div class="review-media">
        <img src="${item.media}" alt="Review by ${item.name}" class="review-img" loading="lazy"
             onerror="this.parentElement.style.display='none'">
      </div>`;
    }
  }

  const handleHTML = item.handle
    ? `<span class="review-handle">${item.handle}</span>` : '';

  const styleHTML = STYLE_LABELS[item.style]
    ? `<span class="review-style-tag">${STYLE_LABELS[item.style]}</span>` : '';

  return `
    <div class="review-card" style="animation-delay:${delay}" itemscope itemtype="https://schema.org/Review">
      <div class="review-header">
        <div class="review-avatar" aria-hidden="true">${initial}</div>
        <div class="review-info">
          <div class="review-name" itemprop="author">${item.name}${handleHTML}</div>
          <div class="review-meta">
            <span class="review-stars" aria-label="${item.rating} out of 5 stars">${buildStars(item.rating)}</span>
            <span class="review-date">${item.date}</span>
          </div>
        </div>
        ${styleHTML}
      </div>
      ${mediaHTML}
      <p class="review-text" itemprop="reviewBody">"${item.text}"</p>
    </div>`;
}

/* ══════════════════════════════════════════
   RENDER — guaranteed to run after DOM ready
   ══════════════════════════════════════════ */
function renderAll() {
  const sGrid = document.getElementById('stickerGrid');
  if (sGrid) {
    if (typeof STICKERS !== 'undefined' && STICKERS.length) {
      sGrid.innerHTML = STICKERS.map((item, i) => buildCard(item, i)).join('');
    } else {
      sGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px">No stickers found. Check data/stickers.js is loading.</p>';
    }
  }

  const rGrid = document.getElementById('reviewsGrid');
  if (rGrid) {
    if (typeof TESTIMONIALS !== 'undefined' && TESTIMONIALS.length) {
      rGrid.innerHTML = TESTIMONIALS.map((item, i) => buildReview(item, i)).join('');
    } else {
      rGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px">No reviews yet. Check data/testimonials.js is loading.</p>';
    }
  }
}

/* Run immediately if DOM ready, otherwise wait */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAll);
} else {
  renderAll();
}

/* ══════════════════════════════════════════
   FIREBASE INIT + AUTH NAV
   ══════════════════════════════════════════ */
const firebaseConfig = {
  apiKey:            "AIzaSyDuVgf-2jF10A8XQR7RZY7s9Ero8Y4KrII",
  authDomain:        "custom-demands.firebaseapp.com",
  projectId:         "custom-demands",
  storageBucket:     "custom-demands.firebasestorage.app",
  messagingSenderId: "885129813571",
  appId:             "1:885129813571:web:0891ca8dee84b80bdb3ef6",
  measurementId:     "G-PDWSS8WQEL",
  databaseURL:       "https://custom-demands-default-rtdb.firebaseio.com"
};

try { firebase.initializeApp(firebaseConfig); } catch(e) { /* already init */ }

const auth = firebase.auth();
const db   = firebase.database();

function avatarURL(user) {
  return user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||'U')}&background=1a1a1a&color=fff&size=80&bold=true`;
}

auth.onAuthStateChanged(async user => {
  const navSignIn   = document.getElementById('navSignIn');
  const navUser     = document.getElementById('navUser');
  const navAvatar   = document.getElementById('navAvatar');
  const navUsername = document.getElementById('navUsername');
  const navDdAvatar = document.getElementById('navDdAvatar');
  const navDdName   = document.getElementById('navDdName');
  const navDdEmail  = document.getElementById('navDdEmail');
  const mobAuthLink = document.getElementById('mobAuthLink');

  if (!user) {
    if (navSignIn)   navSignIn.style.display = '';
    if (navUser)     navUser.style.display   = 'none';
    if (mobAuthLink) { mobAuthLink.textContent = 'Sign In'; mobAuthLink.href = 'auth.html'; }
    return;
  }

  if (navSignIn) navSignIn.style.display = 'none';
  if (navUser)   navUser.style.display   = 'flex';

  const photo = avatarURL(user);
  if (navAvatar)   navAvatar.src   = photo;
  if (navDdAvatar) navDdAvatar.src = photo;
  if (navDdEmail)  navDdEmail.textContent = user.email || '';

  try {
    const snap  = await db.ref('users/' + user.uid).once('value');
    const data  = snap.exists() ? snap.val() : null;
    const uname = data && data.username ? data.username : (user.displayName || 'User');
    if (navUsername) navUsername.textContent = uname;
    if (navDdName)   navDdName.textContent   = '@' + uname;
  } catch {
    if (navUsername) navUsername.textContent = user.displayName || 'User';
    if (navDdName)   navDdName.textContent   = user.displayName || 'User';
  }

  if (mobAuthLink) {
    mobAuthLink.textContent = 'Account Settings';
    mobAuthLink.href = 'auth.html?settings';
  }
});

/* ── UI interactions on DOMContentLoaded ── */
document.addEventListener('DOMContentLoaded', () => {
  const navUserBtn = document.getElementById('navUserBtn');
  const navUser    = document.getElementById('navUser');
  const navDd      = document.getElementById('navDd');
  const navSignOut = document.getElementById('navSignOut');
  const nav        = document.getElementById('mainNav');
  const ham        = document.getElementById('ham');
  const mobMenu    = document.getElementById('mobMenu');

  /* Dropdown */
  if (navUserBtn) {
    navUserBtn.addEventListener('click', e => {
      e.stopPropagation();
      navDd.classList.toggle('open');
    });
  }
  document.addEventListener('click', e => {
    if (navUser && !navUser.contains(e.target)) navDd.classList.remove('open');
  });
  if (navSignOut) {
    navSignOut.addEventListener('click', async () => {
      navDd.classList.remove('open');
      await auth.signOut();
    });
  }

  /* Nav scroll shadow */
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* Hamburger */
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
});

function closeMob() {
  const ham     = document.getElementById('ham');
  const mobMenu = document.getElementById('mobMenu');
  if (mobMenu) mobMenu.classList.remove('open');
  if (ham)     { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); }
}
window.closeMob = closeMob;
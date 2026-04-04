/* ================================
   CUSTOM DEMANDS — index.js
   Reads from data/stickers.js
   and   data/testimonials.js
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
   RENDER STICKER CARDS from data/stickers.js
   ══════════════════════════════════════════ */

/* Style config: badge label + accent color per style type */
const STYLE_CONFIG = {
  kawaii:  { label: '🌸 Kawaii',  color: '#ff6b9d' },
  chibi:   { label: '🥰 Chibi',   color: '#a855f7' },
  anime:   { label: '⚡ Anime',   color: '#f97316' },
  anything:{ label: '✦ Custom',  color: '#059669' },
  sticker: { label: '✨ Sticker', color: '#7c4dff' }
};

function buildStickerCard(item, index) {
  const cfg   = STYLE_CONFIG[item.style] || STYLE_CONFIG.sticker;
  const delay = ((index % 5) * 0.05).toFixed(2);

  /* Media area — real image if provided, placeholder if null */
  const mediaHTML = item.image
    ? `<img src="${item.image}" alt="${item.name}" class="card-img" loading="lazy"/>`
    : `<div class="card-ph">
         <span class="card-num">${String(item.id).padStart(2,'0')}</span>
         <p>Add Image</p>
       </div>`;

  return `
    <article class="card" style="--i:${index + 1};animation-delay:${delay}s"
             itemscope itemtype="https://schema.org/Product">
      <div class="card-img-wrap">${mediaHTML}</div>
      <div class="card-body">
        <span class="card-cat" style="color:${cfg.color};background:${cfg.color}18">${cfg.label}</span>
        <h3 class="card-name" itemprop="name">${item.name}</h3>
        <p  class="card-desc" itemprop="description">${item.desc}</p>
        <div class="card-btns">
          <a href="https://forms.gle/drrjRG7ptcdLWmaa8" target="_blank" rel="noopener"
             class="cbtn-order" style="background:${cfg.color};border-color:${cfg.color}"
             itemprop="url">Order Now</a>
          <a href="https://forms.gle/drrjRG7ptcdLWmaa8" target="_blank" rel="noopener"
             class="cbtn-sec">Customise</a>
        </div>
      </div>
    </article>`;
}

function renderStickers() {
  const grid = document.getElementById('stickerGrid');
  if (!grid || typeof STICKERS === 'undefined') return;
  grid.innerHTML = STICKERS.map((item, i) => buildStickerCard(item, i)).join('');
}

/* ══════════════════════════════════════════
   RENDER REVIEWS from data/testimonials.js
   ══════════════════════════════════════════ */

const STYLE_LABELS = {
  kawaii:  '🌸 Kawaii',
  chibi:   '🥰 Chibi',
  anime:   '⚡ Anime',
  anything:'✦ Anything',
  sticker: '✨ Sticker'
};

function buildStars(n) {
  return Array.from({ length: 5 }, (_, i) =>
    `<svg width="14" height="14" viewBox="0 0 24 24" fill="${i < n ? '#f0a500' : 'none'}"
      stroke="#f0a500" stroke-width="2" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>`
  ).join('');
}

function buildReviewCard(item, index) {
  const delay = ((index % 4) * 0.07).toFixed(2);

  /* Media section (image or video) */
  let mediaHTML = '';
  if (item.media) {
    if (item.mediaType === 'video') {
      mediaHTML = `
        <div class="review-media">
          <video src="${item.media}" controls playsinline preload="metadata"
                 class="review-video" aria-label="Review video by ${item.name}"></video>
        </div>`;
    } else {
      mediaHTML = `
        <div class="review-media">
          <img src="${item.media}" alt="Review photo by ${item.name}"
               class="review-img" loading="lazy"/>
        </div>`;
    }
  }

  const handleHTML = item.handle
    ? `<span class="review-handle">${item.handle}</span>` : '';

  const styleTag = STYLE_LABELS[item.style]
    ? `<span class="review-style-tag">${STYLE_LABELS[item.style]}</span>` : '';

  return `
    <div class="review-card" style="animation-delay:${delay}s"
         itemscope itemtype="https://schema.org/Review">
      <div class="review-header">
        <div class="review-avatar" aria-hidden="true">
          ${item.name.charAt(0).toUpperCase()}
        </div>
        <div class="review-info">
          <div class="review-name" itemprop="author">${item.name}${handleHTML}</div>
          <div class="review-meta">
            <span class="review-stars" aria-label="${item.rating} out of 5 stars">${buildStars(item.rating)}</span>
            <span class="review-date">${item.date}</span>
          </div>
        </div>
        ${styleTag}
      </div>
      ${mediaHTML}
      <p class="review-text" itemprop="reviewBody">"${item.text}"</p>
    </div>`;
}

function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid || typeof TESTIMONIALS === 'undefined') return;
  grid.innerHTML = TESTIMONIALS.map((item, i) => buildReviewCard(item, i)).join('');
}

/* ══════════════════════════════════════════
   FIREBASE CONFIG + AUTH NAV
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.database();

const navSignIn   = document.getElementById('navSignIn');
const navUser     = document.getElementById('navUser');
const navAvatar   = document.getElementById('navAvatar');
const navUsername = document.getElementById('navUsername');
const navDdAvatar = document.getElementById('navDdAvatar');
const navDdName   = document.getElementById('navDdName');
const navDdEmail  = document.getElementById('navDdEmail');
const navDd       = document.getElementById('navDd');
const navUserBtn  = document.getElementById('navUserBtn');
const navSignOut  = document.getElementById('navSignOut');
const mobAuthLink = document.getElementById('mobAuthLink');

function avatarURL(user) {
  return user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||'U')}&background=1a1a1a&color=fff&size=80&bold=true`;
}

auth.onAuthStateChanged(async user => {
  if (!user) {
    navSignIn.style.display = '';
    navUser.style.display   = 'none';
    if (mobAuthLink) { mobAuthLink.textContent = 'Sign In'; mobAuthLink.href = 'auth.html'; }
    return;
  }
  navSignIn.style.display = 'none';
  navUser.style.display   = 'flex';
  const photo = avatarURL(user);
  navAvatar.src   = photo;
  navDdAvatar.src = photo;
  navDdEmail.textContent = user.email || '';
  try {
    const snap  = await db.ref('users/' + user.uid).once('value');
    const data  = snap.exists() ? snap.val() : null;
    const uname = data && data.username ? data.username : (user.displayName || 'User');
    navUsername.textContent = uname;
    navDdName.textContent   = '@' + uname;
  } catch {
    navUsername.textContent = user.displayName || 'User';
    navDdName.textContent   = user.displayName || 'User';
  }
  if (mobAuthLink) { mobAuthLink.textContent = 'Account Settings'; mobAuthLink.href = 'auth.html?settings'; }
});

navUserBtn.addEventListener('click', e => { e.stopPropagation(); navDd.classList.toggle('open'); });
document.addEventListener('click', e => { if (!navUser.contains(e.target)) navDd.classList.remove('open'); });
navSignOut.addEventListener('click', async () => { navDd.classList.remove('open'); await auth.signOut(); });

/* ── NAV SCROLL ── */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 8), { passive: true });

/* ── HAMBURGER ── */
const ham     = document.getElementById('ham');
const mobMenu = document.getElementById('mobMenu');
ham.addEventListener('click', e => {
  e.stopPropagation();
  const open = mobMenu.classList.toggle('open');
  ham.classList.toggle('open', open);
});
document.addEventListener('click', e => {
  if (!ham.contains(e.target) && !mobMenu.contains(e.target)) closeMob();
});
function closeMob() { mobMenu.classList.remove('open'); ham.classList.remove('open'); }
window.closeMob = closeMob;

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); closeMob(); window.scrollTo({ top: t.offsetTop - 74, behavior: 'smooth' }); }
  });
});

/* ── INIT ── */
renderStickers();
renderReviews();

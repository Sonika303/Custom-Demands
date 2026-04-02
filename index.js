/* ================================
   CUSTOM DEMANDS — index.js
   ================================ */

/* ── COPY / PASTE / SELECTION PREVENTION ── */
['copy','cut','paste','selectstart','contextmenu'].forEach(evt => {
  document.addEventListener(evt, e => e.preventDefault(), { passive: false });
});
document.addEventListener('keydown', e => {
  const blocked = (e.ctrlKey || e.metaKey) && ['c','x','u','a','s','p'].includes(e.key.toLowerCase());
  if (blocked) e.preventDefault();
});

/* ── FIREBASE CONFIG ── */
const firebaseConfig = {
  apiKey:            "AIzaSyDuVgf-2jF10A8XQR7RZY7s9Ero8Y4KrII",
  authDomain:        "custom-demands.firebaseapp.com",
  projectId:         "custom-demands",
  storageBucket:     "custom-demands.firebasestorage.app",
  messagingSenderId: "885129813571",
  appId:             "1:885129813571:web:0891ca8dee84b80bdb3ef6",
  measurementId:     "G-PDWSS8WQEL"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

/* ── FIREBASE AUTH STATE ── */
const navSignIn    = document.getElementById('navSignIn');
const navUser      = document.getElementById('navUser');
const navUserBtn   = document.getElementById('navUserBtn');
const navUsername  = document.getElementById('navUsername');
const navAvatar    = document.getElementById('navAvatar');
const navDropdown  = document.getElementById('navDropdown');
const navDropAvatar= document.getElementById('navDropAvatar');
const navDropName  = document.getElementById('navDropName');
const navDropEmail = document.getElementById('navDropEmail');
const navSignOut   = document.getElementById('navSignOut');
const mobileSignIn = document.getElementById('mobileSignIn');

auth.onAuthStateChanged(async user => {
  if (user) {
    // Logged in — show user menu
    navSignIn.style.display = 'none';
    navUser.style.display   = 'flex';

    const photo = user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || 'U') + '&background=0a0a0a&color=fff&size=80';
    navAvatar.src     = photo;
    navDropAvatar.src = photo;
    navDropEmail.textContent = user.email || '';

    // Fetch username from Firestore
    try {
      const snap = await db.collection('users').doc(user.uid).get();
      const uname = snap.exists && snap.data().username
        ? snap.data().username
        : (user.displayName || 'User');
      navUsername.textContent = uname;
      navDropName.textContent = uname;
    } catch {
      navUsername.textContent = user.displayName || 'User';
      navDropName.textContent = user.displayName || 'User';
    }

    if (mobileSignIn) mobileSignIn.textContent = 'Account Settings';

  } else {
    // Logged out
    navSignIn.style.display = '';
    navUser.style.display   = 'none';
    if (mobileSignIn) mobileSignIn.textContent = 'Sign In';
  }
});

/* ── DROPDOWN TOGGLE ── */
navUserBtn.addEventListener('click', e => {
  e.stopPropagation();
  navDropdown.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!navUser.contains(e.target)) navDropdown.classList.remove('open');
});

/* ── SIGN OUT ── */
navSignOut.addEventListener('click', async () => {
  await auth.signOut();
  navDropdown.classList.remove('open');
});

/* ── NAV SCROLL SHADOW ── */
const nav = document.getElementById('mainNav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── HAMBURGER / MOBILE MENU ── */
const ham        = document.getElementById('ham');
const mobileMenu = document.getElementById('mobileMenu');

ham.addEventListener('click', e => {
  e.stopPropagation();
  const open = mobileMenu.classList.toggle('open');
  ham.classList.toggle('open', open);
});
document.addEventListener('click', e => {
  if (!ham.contains(e.target) && !mobileMenu.contains(e.target)) closeMobileMenu();
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  ham.classList.remove('open');
}
window.closeMobileMenu = closeMobileMenu;

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) {
      e.preventDefault();
      closeMobileMenu();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 78, behavior: 'smooth' });
    }
  });
});

/* ── CARD SCROLL REVEAL ── */
const cards = document.querySelectorAll('.card');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    const delay = ((parseInt(card.dataset.i) || 1) - 1) % 5 * 70;
    setTimeout(() => card.classList.add('visible'), delay);
    revealObs.unobserve(card);
  });
}, { threshold: 0.08 });

cards.forEach(c => revealObs.observe(c));

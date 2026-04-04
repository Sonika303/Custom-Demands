/* ================================
   CUSTOM DEMANDS — index.js
   ================================ */

['copy','cut','paste','selectstart','contextmenu'].forEach(evt =>
  document.addEventListener(evt, e => e.preventDefault(), { passive: false })
);
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && ['c','x','u','a','s','p'].includes(e.key.toLowerCase()))
    e.preventDefault();
});

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

const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });

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

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); closeMob(); window.scrollTo({ top: t.offsetTop - 74, behavior: 'smooth' }); }
  });
});

/* ================================
   CUSTOM DEMANDS — auth.js  (FIXED)
   ================================ */

/* ── COPY PREVENTION ── */
['copy','cut','paste','selectstart','contextmenu'].forEach(evt =>
  document.addEventListener(evt, e => e.preventDefault(), { passive: false })
);
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && ['c','x','u','a','s'].includes(e.key.toLowerCase()))
    e.preventDefault();
});

/* ── FIREBASE INIT ── */
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
const auth     = firebase.auth();
const db       = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

/* ── DOM ── */
const loader         = document.getElementById('aLoader');
const screenSignIn   = document.getElementById('screenSignIn');
const screenUsername = document.getElementById('screenUsername');
const screenSettings = document.getElementById('screenSettings');

/* ── URL check: are we on the settings page? ── */
const IS_SETTINGS = new URLSearchParams(window.location.search).has('settings');

/* ── LOADER ── */
function showLoader() { loader.style.display = 'flex'; }
function hideLoader() { loader.style.display = 'none'; }

/* ── SCREENS ── */
function showScreen(id) {
  [screenSignIn, screenUsername, screenSettings].forEach(s => {
    if (s) s.style.display = 'none';
  });
  const el = document.getElementById(id);
  if (el) { el.style.display = ''; }
}

/* ── HELPERS ── */
function avatarURL(user) {
  return user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=0a0a0a&color=fff&size=80&bold=true`;
}

function validateUsername(u) {
  if (!u || u.length < 3)         return 'Must be at least 3 characters.';
  if (u.length > 24)              return 'Must be 24 characters or less.';
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Letters, numbers, and underscores only.';
  return null;
}

/* ── SAFETY NET: loader never hangs beyond 8s ── */
const loaderTimeout = setTimeout(() => {
  hideLoader();
  showScreen('screenSignIn');
}, 8000);

/* ════════════════════════════════════
   AUTH STATE — master controller
   ════════════════════════════════════ */
auth.onAuthStateChanged(async user => {
  clearTimeout(loaderTimeout);

  if (!user) {
    showScreen('screenSignIn');
    hideLoader();
    return;
  }

  /* User is signed in */
  try {
    const snap = await db.collection('users').doc(user.uid).get();
    const data  = snap.exists ? snap.data() : null;
    const hasUsername = data && data.username;

    if (!hasUsername) {
      /* New user — needs username */
      fillUsernameScreen(user);
      showScreen('screenUsername');
      hideLoader();
      return;
    }

    if (IS_SETTINGS) {
      /* Returning user, opened settings */
      fillSettingsScreen(user, data);
      showScreen('screenSettings');
      hideLoader();
    } else {
      /* Normal login — go home immediately */
      window.location.replace('index.html');
    }

  } catch (err) {
    console.error('Auth state error:', err);
    /* Firestore failed — don't block the user */
    if (IS_SETTINGS) {
      fillSettingsScreenFallback(user);
      showScreen('screenSettings');
    } else {
      window.location.replace('index.html');
    }
    hideLoader();
  }
});

/* ════════════════════════════════════
   SCREEN 1 — SIGN IN
   ════════════════════════════════════ */
const btnGoogle   = document.getElementById('btnGoogle');
const signInError = document.getElementById('signInError');
const GOOGLE_HTML = btnGoogle.innerHTML;

btnGoogle.addEventListener('click', async () => {
  signInError.textContent = '';
  btnGoogle.disabled = true;
  btnGoogle.innerHTML = '<span class="spin-icon"></span> Connecting…';
  showLoader();

  try {
    await auth.signInWithPopup(provider);
    /* onAuthStateChanged handles the redirect */
  } catch (err) {
    hideLoader();
    btnGoogle.disabled = false;
    btnGoogle.innerHTML = GOOGLE_HTML;
    const msgs = {
      'auth/popup-closed-by-user':    'Sign-in cancelled.',
      'auth/popup-blocked':           'Popup blocked. Please allow popups for this site.',
      'auth/network-request-failed':  'Network error. Check your connection.',
      'auth/cancelled-popup-request': 'Only one sign-in at a time.',
    };
    signInError.textContent = msgs[err.code] || `Sign-in failed: ${err.message}`;
  }
});

/* ════════════════════════════════════
   SCREEN 2 — PICK USERNAME
   ════════════════════════════════════ */
function fillUsernameScreen(user) {
  document.getElementById('unAvatar').src              = avatarURL(user);
  document.getElementById('unDisplayName').textContent = user.displayName || 'New User';
  document.getElementById('unEmail').textContent       = user.email || '';
  document.getElementById('unInput').value             = '';
  document.getElementById('unError').textContent       = '';
  setTimeout(() => document.getElementById('unInput').focus(), 300);
}

document.getElementById('btnSaveUsername').addEventListener('click', saveNewUsername);
document.getElementById('unInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') saveNewUsername();
});

async function saveNewUsername() {
  const user = auth.currentUser;
  if (!user) return;

  const input = document.getElementById('unInput');
  const errEl = document.getElementById('unError');
  const btn   = document.getElementById('btnSaveUsername');
  const val   = input.value.trim().toLowerCase();

  errEl.textContent = '';
  const vErr = validateUsername(val);
  if (vErr) { errEl.textContent = vErr; return; }

  btn.disabled    = true;
  btn.textContent = 'Saving…';

  try {
    const taken = await db.collection('users')
      .where('username', '==', val).limit(1).get();

    if (!taken.empty) {
      errEl.textContent = 'Username taken — try another one.';
      btn.disabled    = false;
      btn.textContent = 'Save & Continue';
      return;
    }

    await db.collection('users').doc(user.uid).set({
      username:    val,
      email:       user.email        || '',
      displayName: user.displayName  || '',
      photoURL:    user.photoURL     || '',
      createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:   firebase.firestore.FieldValue.serverTimestamp()
    });

    /* Done — go home */
    window.location.replace('index.html');

  } catch (err) {
    console.error('Save username:', err);
    errEl.textContent = 'Could not save. Please try again.';
    btn.disabled    = false;
    btn.textContent = 'Save & Continue';
  }
}

/* ════════════════════════════════════
   SCREEN 3 — SETTINGS
   ════════════════════════════════════ */
function fillSettingsScreen(user, data) {
  const uname = data.username || user.displayName || 'user';
  const photo = avatarURL(user);

  document.getElementById('sAvatar').src              = photo;
  document.getElementById('sDisplayUsername').textContent = '@' + uname;
  document.getElementById('sDisplayEmail').textContent = user.email || '';

  const ts = data.createdAt && data.createdAt.toDate
    ? data.createdAt.toDate().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })
    : '—';
  document.getElementById('sSince').textContent = 'Member since ' + ts;

  document.getElementById('settingsUsernameInput').value = uname;
  document.getElementById('infoName').textContent  = user.displayName || '—';
  document.getElementById('infoEmail').textContent = user.email        || '—';
  document.getElementById('infoUID').textContent   = user.uid;
}

function fillSettingsScreenFallback(user) {
  fillSettingsScreen(user, { username: user.displayName || 'user' });
}

/* Tabs */
document.querySelectorAll('.s-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.s-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.s-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

/* Save username */
document.getElementById('btnSaveSettings').addEventListener('click', saveSettings);
document.getElementById('settingsUsernameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') saveSettings();
});

async function saveSettings() {
  const user = auth.currentUser;
  if (!user) return;

  const input = document.getElementById('settingsUsernameInput');
  const errEl = document.getElementById('sError');
  const okEl  = document.getElementById('sSuccess');
  const btn   = document.getElementById('btnSaveSettings');
  const val   = input.value.trim().toLowerCase();

  errEl.textContent = '';
  okEl.textContent  = '';

  const vErr = validateUsername(val);
  if (vErr) { errEl.textContent = vErr; return; }

  btn.disabled    = true;
  btn.textContent = 'Saving…';

  try {
    const snap = await db.collection('users').doc(user.uid).get();
    const current = snap.exists ? snap.data().username : '';

    if (val !== current) {
      const taken = await db.collection('users')
        .where('username', '==', val).limit(1).get();
      if (!taken.empty) {
        errEl.textContent = 'Username taken — try another.';
        btn.disabled    = false;
        btn.textContent = 'Save Changes';
        return;
      }
    }

    await db.collection('users').doc(user.uid).update({
      username:  val,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.getElementById('sDisplayUsername').textContent = '@' + val;
    okEl.textContent = '✓ Saved!';
    setTimeout(() => { okEl.textContent = ''; }, 3000);

  } catch (err) {
    console.error('Settings save:', err);
    errEl.textContent = 'Could not save. Please try again.';
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Save Changes';
  }
}

/* Sign out */
document.getElementById('btnSignOut').addEventListener('click', async () => {
  showLoader();
  try {
    await auth.signOut();
    window.location.replace('auth.html');
  } catch (e) {
    console.error('Sign out:', e);
    hideLoader();
  }
});

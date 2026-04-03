/* ================================
   CUSTOM DEMANDS — auth.js
   Uses Firebase Realtime Database
   ================================
   Screens:
   1. screenSignIn   — default, not logged in
   2. screenAlready  — logged in, visited auth.html (no ?settings)
   3. screenUsername — logged in, no username set yet
   4. screenSettings — logged in, visited auth.html?settings
*/

/* ── FIREBASE ── */
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
const auth     = firebase.auth();
const db       = firebase.database();           // Realtime Database
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

/* ── URL param ── */
const IS_SETTINGS = new URLSearchParams(window.location.search).has('settings');

/* ── DOM shortcut ── */
const $  = id => document.getElementById(id);
const SCREENS = ['screenSignIn','screenAlready','screenUsername','screenSettings'];

function showOnly(id) {
  SCREENS.forEach(s => {
    const el = $(s);
    if (el) el.style.display = (s === id) ? '' : 'none';
  });
}

function avatarURL(user) {
  return user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=0a0a0a&color=fff&size=80&bold=true`;
}

function validateU(u) {
  if (!u || u.length < 3)          return 'At least 3 characters required.';
  if (u.length > 24)               return '24 characters maximum.';
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Only letters, numbers, and underscores.';
  return null;
}

/* ────────────────────────────────────
   Realtime DB helpers
   Path: users/{uid}/profile
         users/{uid}/orders   (you manage this)
   ─────────────────────────────────── */
function userRef(uid) {
  return db.ref('users/' + uid);
}

async function getUserData(uid) {
  const snap = await userRef(uid).once('value');
  return snap.exists() ? snap.val() : null;
}

async function setUserData(uid, data) {
  await userRef(uid).update(data);
}

/* ════════════════════════════════════
   AUTH STATE — main controller
   ════════════════════════════════════ */
auth.onAuthStateChanged(async user => {
  if (!user) {
    /* Not signed in — show sign-in screen (it's already visible by default) */
    showOnly('screenSignIn');
    return;
  }

  /* User is signed in */
  try {
    let data = await getUserData(user.uid);

    /* First time — create the user node in Realtime DB */
    if (!data) {
      const newData = {
        uid:         user.uid,
        email:       user.email        || '',
        displayName: user.displayName  || '',
        photoURL:    user.photoURL     || '',
        username:    '',
        createdAt:   Date.now()
      };
      await userRef(user.uid).set(newData);
      data = newData;
      console.log('New user created in Realtime DB:', user.uid);
    }

    const hasUsername = data.username && data.username.length >= 3;

    if (!hasUsername) {
      /* No username yet — show picker */
      $('upAvatar').src           = avatarURL(user);
      $('upName').textContent     = user.displayName || 'New User';
      $('upEmail').textContent    = user.email       || '';
      $('unInput').value          = '';
      $('unError').textContent    = '';
      showOnly('screenUsername');
      setTimeout(() => $('unInput').focus(), 280);

    } else if (IS_SETTINGS) {
      /* Settings page */
      fillSettings(user, data);
      showOnly('screenSettings');

    } else {
      /* Already signed in, just visiting auth.html */
      $('alreadyAvatar').src          = avatarURL(user);
      $('alreadyTitle').textContent   = 'Hey, @' + data.username;
      $('alreadyEmail').textContent   = user.email || '';
      showOnly('screenAlready');
    }

  } catch (err) {
    console.error('DB error:', err);
    /* Fallback — don't leave user stuck */
    if (IS_SETTINGS) {
      fillSettingsFallback(user);
      showOnly('screenSettings');
    } else if (user) {
      /* At least show the "already signed in" screen */
      $('alreadyAvatar').src        = avatarURL(user);
      $('alreadyTitle').textContent = 'Hey, ' + (user.displayName || 'there');
      $('alreadyEmail').textContent = user.email || '';
      showOnly('screenAlready');
    } else {
      showOnly('screenSignIn');
    }
  }
});

/* ════════════════════════════════════
   SCREEN 1 — SIGN IN
   ════════════════════════════════════ */
const GOOGLE_HTML = $('btnGoogle').innerHTML;

$('btnGoogle').addEventListener('click', async () => {
  $('signInError').textContent = '';
  $('btnGoogle').disabled      = true;
  $('btnGoogle').innerHTML     = '<span class="btn-google-spinner"></span>&nbsp; Connecting…';

  try {
    await auth.signInWithPopup(provider);
    /* onAuthStateChanged handles the rest */
  } catch (err) {
    $('btnGoogle').disabled  = false;
    $('btnGoogle').innerHTML = GOOGLE_HTML;
    const msgs = {
      'auth/popup-closed-by-user':    'Sign-in cancelled.',
      'auth/popup-blocked':           'Popup blocked — please allow popups for this site.',
      'auth/network-request-failed':  'Network error. Check your connection.',
      'auth/cancelled-popup-request': 'Only one sign-in at a time.',
    };
    $('signInError').textContent = msgs[err.code] || 'Sign-in failed. Try again.';
  }
});

/* ════════════════════════════════════
   SCREEN 2 — ALREADY SIGNED IN
   ════════════════════════════════════ */
$('btnAlreadySignOut').addEventListener('click', doSignOut);

/* ════════════════════════════════════
   SCREEN 3 — PICK USERNAME
   ════════════════════════════════════ */
$('btnSaveUsername').addEventListener('click', saveNewUsername);
$('unInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveNewUsername(); });

async function saveNewUsername() {
  const user = auth.currentUser;
  if (!user) return;

  const val  = $('unInput').value.trim().toLowerCase();
  const vErr = validateU(val);
  if (vErr) { $('unError').textContent = vErr; return; }

  $('unError').textContent        = '';
  $('btnSaveUsername').disabled   = true;
  $('btnSaveUsername').textContent = 'Saving…';

  try {
    /* Check username uniqueness across all users */
    const snap = await db.ref('users').orderByChild('username').equalTo(val).limitToFirst(1).once('value');
    if (snap.exists()) {
      $('unError').textContent        = 'That username is taken — try another.';
      $('btnSaveUsername').disabled   = false;
      $('btnSaveUsername').textContent = 'Save & Continue';
      return;
    }

    /* Save username to Realtime DB */
    await userRef(user.uid).update({
      username:  val,
      updatedAt: Date.now()
    });

    $('redirOverlay').classList.add('show');
    window.location.replace('index.html');

  } catch (err) {
    console.error('Save username:', err);
    $('unError').textContent        = 'Could not save. Please try again.';
    $('btnSaveUsername').disabled   = false;
    $('btnSaveUsername').textContent = 'Save & Continue';
  }
}

/* ════════════════════════════════════
   SCREEN 4 — SETTINGS
   ════════════════════════════════════ */
function fillSettings(user, data) {
  const uname = data.username || user.displayName || 'user';
  const photo = avatarURL(user);

  $('spAvatar').src           = photo;
  $('spUsername').textContent = '@' + uname;
  $('spEmail').textContent    = user.email || '';

  const ts = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })
    : '—';
  $('spSince').textContent = 'Member since ' + ts;

  $('settingsUsername').value  = uname;
  $('infoName').textContent    = user.displayName || '—';
  $('infoEmail').textContent   = user.email       || '—';
  $('infoUID').textContent     = user.uid;

  /* Clear messages */
  $('sError').textContent   = '';
  $('sSuccess').textContent = '';
}

function fillSettingsFallback(user) {
  fillSettings(user, { username: user.displayName || 'user', createdAt: null });
}

/* Tabs */
document.querySelectorAll('.stab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.spanel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    $(tab.dataset.panel).classList.add('active');
  });
});

/* Save settings */
$('btnSaveSettings').addEventListener('click', saveSettings);
$('settingsUsername').addEventListener('keydown', e => { if (e.key === 'Enter') saveSettings(); });

async function saveSettings() {
  const user = auth.currentUser;
  if (!user) return;

  const val  = $('settingsUsername').value.trim().toLowerCase();
  const vErr = validateU(val);
  $('sError').textContent   = '';
  $('sSuccess').textContent = '';

  if (vErr) { $('sError').textContent = vErr; return; }

  $('btnSaveSettings').disabled    = true;
  $('btnSaveSettings').textContent = 'Saving…';

  try {
    const data    = await getUserData(user.uid);
    const current = data ? data.username : '';

    if (val !== current) {
      /* Check uniqueness */
      const snap = await db.ref('users').orderByChild('username').equalTo(val).limitToFirst(1).once('value');
      if (snap.exists()) {
        $('sError').textContent          = 'Username taken — try another.';
        $('btnSaveSettings').disabled    = false;
        $('btnSaveSettings').textContent = 'Save Changes';
        return;
      }
    }

    await userRef(user.uid).update({ username: val, updatedAt: Date.now() });

    $('spUsername').textContent = '@' + val;
    $('sSuccess').textContent   = '✓ Saved successfully!';
    setTimeout(() => { $('sSuccess').textContent = ''; }, 3000);

  } catch (err) {
    console.error('Settings save:', err);
    $('sError').textContent = 'Could not save. Please try again.';
  } finally {
    $('btnSaveSettings').disabled    = false;
    $('btnSaveSettings').textContent = 'Save Changes';
  }
}

/* Sign out */
$('btnSignOut').addEventListener('click', doSignOut);

async function doSignOut() {
  $('redirOverlay').classList.add('show');
  try {
    await auth.signOut();
    window.location.replace('auth.html');
  } catch (e) {
    $('redirOverlay').classList.remove('show');
    console.error('Sign out:', e);
  }
}

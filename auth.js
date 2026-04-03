/* ── FIREBASE ── */
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

/* ── URL param ── */
const IS_SETTINGS = new URLSearchParams(window.location.search).has('settings');

/* ── DOM helpers ── */
const $ = id => document.getElementById(id);

function showOnly(id) {
  ['screenSignIn','screenUsername','screenSettings'].forEach(s => {
    const el = $(s);
    if (el) el.style.display = (s === id) ? '' : 'none';
  });
}

function avatarURL(user) {
  return user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||'U')}&background=0a0a0a&color=fff&size=80&bold=true`;
}

function validateU(u) {
  if (!u || u.length < 3)          return 'At least 3 characters required.';
  if (u.length > 24)               return '24 characters maximum.';
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Only letters, numbers, and underscores.';
  return null;
}

/* ── AUTH STATE ── */
auth.onAuthStateChanged(async user => {
  if (!user) return; 

  try {
    const userRef = db.collection('users').doc(user.uid);
    const snap = await userRef.get();
    
    // NEW: If user doesn't exist at all in Firestore, create the basic doc immediately
    if (!snap.exists) {
      await userRef.set({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        username: null, // This triggers the username picker below
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log("Initial user doc created in Firestore!");
    }

    const data = snap.exists ? snap.data() : null;
    const hasUN = data && data.username;

    if (!hasUN) {
      /* New user or user without username — pick username */
      $('upAvatar').src = avatarURL(user);
      $('upName').textContent = user.displayName || 'New User';
      $('upEmail').textContent = user.email || '';
      showOnly('screenUsername');
      setTimeout(() => $('unInput').focus(), 280);
    } else if (IS_SETTINGS) {
      fillSettings(user, data);
      showOnly('screenSettings');
    } else {
      $('redirectOverlay').classList.add('show');
      window.location.replace('index.html');
    }
  } catch (err) {
    console.error('Firestore error:', err);
    if (IS_SETTINGS) {
      fillSettingsFallback(user);
      showOnly('screenSettings');
    } else {
      window.location.replace('index.html');
    }
  }
});
/* ════════════════════════════════
   SIGN IN SCREEN
   ════════════════════════════════ */
const GOOGLE_BTN_HTML = $('btnGoogle').innerHTML;

$('btnGoogle').addEventListener('click', async () => {
  $('signInError').textContent = '';
  $('btnGoogle').disabled = true;
  $('btnGoogle').innerHTML = '<span class="btn-google-spinner"></span>&nbsp; Connecting…';

  try {
    await auth.signInWithPopup(provider);
    /* onAuthStateChanged will handle the rest */
  } catch (err) {
    $('btnGoogle').disabled = false;
    $('btnGoogle').innerHTML = GOOGLE_BTN_HTML;
    const msgs = {
      'auth/popup-closed-by-user':    'Sign-in cancelled.',
      'auth/popup-blocked':           'Popup blocked — please allow popups for this site.',
      'auth/network-request-failed':  'Network error. Check your connection.',
      'auth/cancelled-popup-request': 'Only one sign-in window at a time.',
    };
    $('signInError').textContent = msgs[err.code] || 'Sign-in failed. Try again.';
  }
});

/* ════════════════════════════════
   USERNAME SCREEN
   ════════════════════════════════ */
$('btnSaveUsername').addEventListener('click', saveNewUsername);
$('unInput').addEventListener('keydown', e => { if (e.key === 'Enter') saveNewUsername(); });

async function saveNewUsername() {
  const user = auth.currentUser;
  if (!user) return;

  const val  = $('unInput').value.trim().toLowerCase();
  const err  = validateU(val);
  if (err) { $('unError').textContent = err; return; }

  $('unError').textContent = '';
  $('btnSaveUsername').disabled = true;
  $('btnSaveUsername').textContent = 'Saving…';

  try {
    const taken = await db.collection('users').where('username','==',val).limit(1).get();
    if (!taken.empty) {
      $('unError').textContent = 'That username is taken — try another.';
      $('btnSaveUsername').disabled = false;
      $('btnSaveUsername').textContent = 'Save & Continue';
      return;
    }

    await db.collection('users').doc(user.uid).update({
      username: val,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
      username:    val,
      email:       user.email        || '',
      displayName: user.displayName  || '',
      photoURL:    user.photoURL     || '',
      createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:   firebase.firestore.FieldValue.serverTimestamp()
    });

    $('redirectOverlay').classList.add('show');
    window.location.replace('index.html');

  } catch (err) {
    console.error('Save username:', err);
    $('unError').textContent = 'Could not save. Please try again.';
    $('btnSaveUsername').disabled = false;
    $('btnSaveUsername').textContent = 'Save & Continue';
  }
}

/* ════════════════════════════════
   SETTINGS SCREEN
   ════════════════════════════════ */
function fillSettings(user, data) {
  const uname = data.username || user.displayName || 'user';
  const photo = avatarURL(user);

  $('spAvatar').src    = photo;
  $('spUsername').textContent = '@' + uname;
  $('spEmail').textContent    = user.email || '';

  const ts = data.createdAt && data.createdAt.toDate
    ? data.createdAt.toDate().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' })
    : '—';
  $('spSince').textContent = 'Member since ' + ts;

  $('settingsUsername').value   = uname;
  $('infoName').textContent     = user.displayName || '—';
  $('infoEmail').textContent    = user.email       || '—';
  $('infoUID').textContent      = user.uid;
}

function fillSettingsFallback(user) {
  fillSettings(user, { username: user.displayName || 'user' });
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

  $('btnSaveSettings').disabled = true;
  $('btnSaveSettings').textContent = 'Saving…';

  try {
    const snap    = await db.collection('users').doc(user.uid).get();
    const current = snap.exists ? snap.data().username : '';

    if (val !== current) {
      const taken = await db.collection('users').where('username','==',val).limit(1).get();
      if (!taken.empty) {
        $('sError').textContent = 'Username taken — try another.';
        $('btnSaveSettings').disabled = false;
        $('btnSaveSettings').textContent = 'Save Changes';
        return;
      }
    }

    await db.collection('users').doc(user.uid).update({
      username:  val,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    $('spUsername').textContent = '@' + val;
    $('sSuccess').textContent   = '✓ Saved successfully!';
    setTimeout(() => { $('sSuccess').textContent = ''; }, 3000);

  } catch (err) {
    console.error('Settings save:', err);
    $('sError').textContent = 'Could not save. Please try again.';
  } finally {
    $('btnSaveSettings').disabled = false;
    $('btnSaveSettings').textContent = 'Save Changes';
  }
}

/* Sign out */
$('btnSignOut').addEventListener('click', async () => {
  $('redirectOverlay').classList.add('show');
  try {
    await auth.signOut();
    window.location.replace('auth.html');
  } catch (e) {
    $('redirectOverlay').classList.remove('show');
  }
});

/* ================================
   CUSTOM DEMANDS — auth.js
   Firebase Auth + Firestore Logic
   ================================ */

/* ── COPY / PASTE PREVENTION ── */
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

/* ── DOM REFS ── */
const loader          = document.getElementById('aLoader');

const screenSignIn    = document.getElementById('screenSignIn');
const screenUsername  = document.getElementById('screenUsername');
const screenProfile   = document.getElementById('screenProfile');

// Sign In screen
const btnGoogle       = document.getElementById('btnGoogle');
const signInError     = document.getElementById('signInError');

// Username screen
const usernameAvatar  = document.getElementById('usernameAvatar');
const usernameDisplay = document.getElementById('usernameDisplayName');
const usernameEmailEl = document.getElementById('usernameEmail');
const usernameInput   = document.getElementById('usernameInput');
const usernameError   = document.getElementById('usernameError');
const btnSaveUsername = document.getElementById('btnSaveUsername');

// Profile screen
const profileAvatar   = document.getElementById('profileAvatar');
const profileUsername = document.getElementById('profileUsername');
const profileEmail    = document.getElementById('profileEmail');
const profileSince    = document.getElementById('profileSince');

const settingsUsername= document.getElementById('settingsUsername');
const settingsError   = document.getElementById('settingsError');
const settingsSuccess = document.getElementById('settingsSuccess');
const btnSaveSettings = document.getElementById('btnSaveSettings');

const infoDisplayName = document.getElementById('infoDisplayName');
const infoEmail       = document.getElementById('infoEmail');
const infoUID         = document.getElementById('infoUID');

const btnSignOut      = document.getElementById('btnSignOut');
const tabs            = document.querySelectorAll('.a-tab');
const tabContents     = document.querySelectorAll('.a-tab-content');

/* ── UTILS ── */
const showLoader = () => loader.classList.remove('hidden');
const hideLoader = () => loader.classList.add('hidden');

function showScreen(id) {
  [screenSignIn, screenUsername, screenProfile].forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = '';
}

function setError(el, msg) { el.textContent = msg; }
function setSuccess(el, msg) { el.textContent = msg; }
function clearMsg(el) { el.textContent = ''; }

function avatarURL(user) {
  return user.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName||'U')}&background=0a0a0a&color=fff&size=80`;
}

function validateUsername(u) {
  if (!u || u.length < 3) return 'Username must be at least 3 characters.';
  if (u.length > 24)       return 'Username must be 24 characters or less.';
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Only letters, numbers, and underscores allowed.';
  return null;
}

/* ── AUTH STATE ── */
auth.onAuthStateChanged(async user => {
  if (!user) {
    showScreen('screenSignIn');
    hideLoader();
    return;
  }

  try {
    const snap = await db.collection('users').doc(user.uid).get();

    if (!snap.exists || !snap.data().username) {
      // New user — show username setup
      usernameAvatar.src            = avatarURL(user);
      usernameDisplay.textContent   = user.displayName || 'New User';
      usernameEmailEl.textContent   = user.email || '';
      usernameInput.value           = '';
      showScreen('screenUsername');
      hideLoader();
      setTimeout(() => usernameInput.focus(), 300);
    } else {
      // Returning user — show profile
      const data = snap.data();
      populateProfile(user, data);
      showScreen('screenProfile');
      hideLoader();
    }
  } catch (err) {
    console.error('Firestore read error:', err);
    showScreen('screenSignIn');
    setError(signInError, 'Could not fetch profile. Please try again.');
    hideLoader();
  }
});

/* ── GOOGLE SIGN IN ── */
btnGoogle.addEventListener('click', async () => {
  clearMsg(signInError);
  btnGoogle.disabled = true;
  btnGoogle.textContent = 'Connecting…';
  showLoader();

  try {
    await auth.signInWithPopup(provider);
    // auth state change handler takes over
  } catch (err) {
    hideLoader();
    btnGoogle.disabled = false;
    btnGoogle.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google`;

    const friendly = {
      'auth/popup-closed-by-user':    'Sign-in was cancelled.',
      'auth/popup-blocked':           'Popup was blocked. Please allow popups for this site.',
      'auth/network-request-failed':  'Network error. Check your connection and try again.',
    };
    setError(signInError, friendly[err.code] || 'Sign-in failed. Please try again.');
  }
});

/* ── SAVE USERNAME (new users) ── */
btnSaveUsername.addEventListener('click', () => saveNewUsername());
usernameInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveNewUsername(); });

async function saveNewUsername() {
  const user = auth.currentUser;
  if (!user) return;

  const val = usernameInput.value.trim();
  const err = validateUsername(val);
  if (err) { setError(usernameError, err); return; }

  clearMsg(usernameError);
  btnSaveUsername.disabled = true;
  btnSaveUsername.textContent = 'Saving…';

  try {
    // Check uniqueness
    const existing = await db.collection('users').where('username', '==', val).get();
    if (!existing.empty) {
      setError(usernameError, 'This username is already taken. Try another.');
      btnSaveUsername.disabled = false;
      btnSaveUsername.textContent = 'Save Username & Continue';
      return;
    }

    await db.collection('users').doc(user.uid).set({
      username:    val,
      email:       user.email || '',
      displayName: user.displayName || '',
      photoURL:    user.photoURL || '',
      createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt:   firebase.firestore.FieldValue.serverTimestamp()
    });

    // Show profile screen
    const snap = await db.collection('users').doc(user.uid).get();
    populateProfile(user, snap.data());
    showScreen('screenProfile');
  } catch (err) {
    console.error('Save username error:', err);
    setError(usernameError, 'Could not save username. Please try again.');
    btnSaveUsername.disabled = false;
    btnSaveUsername.textContent = 'Save Username & Continue';
  }
}

/* ── POPULATE PROFILE ── */
function populateProfile(user, data) {
  const uname = data.username || user.displayName || 'User';
  const photo = avatarURL(user);

  // Header
  profileAvatar.src       = photo;
  profileUsername.textContent = '@' + uname;
  profileEmail.textContent    = user.email || '';

  const created = data.createdAt && data.createdAt.toDate
    ? data.createdAt.toDate().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';
  profileSince.textContent = 'Member since ' + created;

  // Dropdown avatars
  const da = document.getElementById('navDropAvatar');
  if (da) { da.src = photo; }

  // Settings tab inputs
  settingsUsername.value = uname;

  // Account tab
  infoDisplayName.textContent = user.displayName || '—';
  infoEmail.textContent       = user.email || '—';
  infoUID.textContent         = user.uid;
}

/* ── SAVE SETTINGS ── */
btnSaveSettings.addEventListener('click', saveSettings);
settingsUsername.addEventListener('keydown', e => { if (e.key === 'Enter') saveSettings(); });

async function saveSettings() {
  const user = auth.currentUser;
  if (!user) return;

  clearMsg(settingsError);
  clearMsg(settingsSuccess);

  const newUsername = settingsUsername.value.trim();
  const err = validateUsername(newUsername);
  if (err) { setError(settingsError, err); return; }

  btnSaveSettings.disabled = true;
  btnSaveSettings.textContent = 'Saving…';

  try {
    // Check if username changed
    const snap = await db.collection('users').doc(user.uid).get();
    const currentUsername = snap.exists ? snap.data().username : '';

    if (newUsername !== currentUsername) {
      // Check uniqueness
      const existing = await db.collection('users').where('username', '==', newUsername).get();
      if (!existing.empty) {
        setError(settingsError, 'This username is already taken. Try another.');
        btnSaveSettings.disabled = false;
        btnSaveSettings.textContent = 'Save Changes';
        return;
      }
    }

    await db.collection('users').doc(user.uid).update({
      username:  newUsername,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    profileUsername.textContent = '@' + newUsername;
    setSuccess(settingsSuccess, '✓ Changes saved successfully!');
    setTimeout(() => clearMsg(settingsSuccess), 3500);
  } catch (err) {
    console.error('Settings save error:', err);
    setError(settingsError, 'Could not save changes. Please try again.');
  } finally {
    btnSaveSettings.disabled = false;
    btnSaveSettings.textContent = 'Save Changes';
  }
}

/* ── SIGN OUT ── */
btnSignOut.addEventListener('click', async () => {
  showLoader();
  try {
    await auth.signOut();
    // auth state change will show sign-in screen
  } catch (e) {
    hideLoader();
    console.error('Sign out error:', e);
  }
});

/* ── TABS ── */
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab' + target.charAt(0).toUpperCase() + target.slice(1)).classList.add('active');
  });
});

const STORAGE_KEY = "studyflow_extension_auth";

async function saveAuth(token, user) {
  if (!token) return;
  await chrome.storage.local.set({ token, user, connectedAt: Date.now() });
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function readAuthFromPage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.token) return null;
    if (data.ts && Date.now() - data.ts > 10 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

async function syncFromPageStorage() {
  const data = readAuthFromPage();
  if (data) {
    await saveAuth(data.token, data.user);
    return true;
  }
  return false;
}

window.addEventListener("studyflow-auth", async (event) => {
  const { token, user } = event.detail || {};
  await saveAuth(token, user);
});

// Catch token even if the event fired before this script loaded
syncFromPageStorage();
const syncInterval = setInterval(syncFromPageStorage, 400);
setTimeout(() => clearInterval(syncInterval), 15000);

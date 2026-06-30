const APP_URL = "http://localhost:3000";

const authSection = document.getElementById("authSection");
const mainSection = document.getElementById("mainSection");
const loadingSection = document.getElementById("loadingSection");
const recentList = document.getElementById("recentList");
const userEmailEl = document.getElementById("userEmail");
const userAvatarEl = document.getElementById("userAvatar");
const userChipEl = document.getElementById("userChip");
const statusEl = document.getElementById("statusMsg");

function setStatus(msg, isError = false) {
  if (!statusEl) return;
  statusEl.textContent = msg || "";
  statusEl.className = isError ? "status-msg error" : "status-msg";
  statusEl.classList.toggle("hidden", !msg);
}

async function verifyToken(token) {
  try {
    const res = await fetch(`${APP_URL}/api/extension/token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.authenticated ? data.user : null;
  } catch {
    return null;
  }
}

async function init() {
  const { token, recent } = await chrome.storage.local.get(["token", "recent"]);

  if (token) {
    const verified = await verifyToken(token);
    if (verified) {
      showMain(verified);
      renderRecent(recent || []);
      return;
    }
    await chrome.storage.local.remove(["token", "user", "connectedAt"]);
  }

  authSection.classList.remove("hidden");
  mainSection.classList.add("hidden");
}

function showMain(user) {
  authSection.classList.add("hidden");
  mainSection.classList.remove("hidden");

  if (userEmailEl && user?.email) {
    userEmailEl.textContent = user.email;
  }
  if (userAvatarEl && user?.email) {
    userAvatarEl.textContent = (user.name?.[0] || user.email[0]).toUpperCase();
  }
  if (userChipEl) {
    userChipEl.classList.remove("hidden");
  }
}

function showLoading() {
  mainSection.classList.add("hidden");
  authSection.classList.add("hidden");
  loadingSection.classList.remove("hidden");
  setStatus("");
}

function hideLoading() {
  loadingSection.classList.add("hidden");
  mainSection.classList.remove("hidden");
}

function renderRecent(items) {
  if (!items.length) {
    recentList.innerHTML = '<li class="recent-empty">No recent scans</li>';
    return;
  }
  recentList.innerHTML = items
    .slice(0, 5)
    .map((item) => `<li data-id="${item.id}" title="${item.title}">${item.title}</li>`)
    .join("");

  recentList.querySelectorAll("li[data-id]").forEach((li) => {
    li.addEventListener("click", () => {
      chrome.tabs.create({ url: `${APP_URL}/dashboard/materials/${li.dataset.id}` });
    });
  });
}

async function getPageContent() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No active tab");

  const url = tab.url || "";
  if (url.startsWith("chrome://") || url.startsWith("chrome-extension://") || url.startsWith("edge://")) {
    throw new Error("Open a webpage, PDF, or YouTube video first.");
  }
  if (url.startsWith(APP_URL)) {
    throw new Error("Open the page you want to study, not StudyFlow.");
  }

  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => ({
      title: document.title,
      url: window.location.href,
      content: document.body?.innerText?.slice(0, 50000) || "",
    }),
  });
  return result;
}

async function scanContent(type) {
  showLoading();
  try {
    const { token } = await chrome.storage.local.get("token");
    if (!token) throw new Error("Please sign in first.");

    const page = await getPageContent();
    if (!page.content?.trim()) {
      throw new Error("No text found on this page.");
    }

    const res = await fetch(`${APP_URL}/api/scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: page.title || "Untitled",
        type,
        content: page.content,
        sourceUrl: page.url,
      }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Server error. Is npm run dev running?");
    }

    if (!res.ok) throw new Error(data.error || `Scan failed (${res.status})`);

    const { recent = [] } = await chrome.storage.local.get("recent");
    const updated = [{ id: data.id, title: data.title }, ...recent.filter((r) => r.id !== data.id)].slice(0, 10);
    await chrome.storage.local.set({ recent: updated });
    renderRecent(updated);

    chrome.tabs.create({ url: `${APP_URL}/dashboard/materials/${data.id}` });
  } catch (err) {
    const msg = err.message || "Failed to analyze content.";
    alert(msg);
  } finally {
    hideLoading();
  }
}

document.getElementById("loginBtn").addEventListener("click", () => {
  chrome.tabs.create({ url: `${APP_URL}/login?extension=true` });
});

document.getElementById("analyzePdf").addEventListener("click", () => scanContent("PDF"));
document.getElementById("analyzeVideo").addEventListener("click", () => scanContent("YOUTUBE"));
document.getElementById("analyzePage").addEventListener("click", () => scanContent("WEBPAGE"));
document.getElementById("dashboardBtn").addEventListener("click", () => {
  chrome.tabs.create({ url: `${APP_URL}/dashboard` });
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  chrome.storage.local.set({ theme: isLight ? "light" : "dark" });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.token?.newValue) init();
});

chrome.storage.local.get("theme", ({ theme }) => {
  if (theme === "light") document.body.classList.add("light");
});

init();

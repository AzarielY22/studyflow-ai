const APP_URL = "http://localhost:3000";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "studyflow-highlight",
    title: "Study with StudyFlow AI",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "studyflow-highlight" && info.selectionText && tab?.id) {
    const title = `Highlight: ${info.selectionText.slice(0, 50)}...`;
    chrome.tabs.create({
      url: `${APP_URL}/dashboard?scan=highlight&content=${encodeURIComponent(info.selectionText)}&title=${encodeURIComponent(title)}`,
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_PAGE_INFO") {
    sendResponse({ url: APP_URL });
  }
  if (message.type === "AUTH_CONNECTED") {
    sendResponse({ ok: true });
  }
});

// When user visits localhost after login, pick up token from page storage
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url?.startsWith(`${APP_URL}/extension/callback`)) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const key = "studyflow_extension_auth";
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        return JSON.parse(raw);
      },
    }).then(async ([result]) => {
      const data = result?.result;
      if (data?.token) {
        await chrome.storage.local.set({
          token: data.token,
          user: data.user,
          connectedAt: Date.now(),
        });
      }
    });
  } catch {
    // tab may have closed
  }
});

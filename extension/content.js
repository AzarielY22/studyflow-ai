// Content script - detects page type and enables highlight context

function detectPageType() {
  const url = window.location.href;
  if (url.includes("youtube.com/watch")) return "YOUTUBE";
  if (url.endsWith(".pdf") || document.contentType === "application/pdf") return "PDF";
  return "WEBPAGE";
}

const pageType = detectPageType();
document.documentElement.dataset.studyflowType = pageType;

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_CONTENT") {
    sendResponse({
      title: document.title,
      url: window.location.href,
      content: document.body.innerText.slice(0, 50000),
      type: pageType,
    });
  }
});

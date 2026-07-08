export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://www.getstudyflow.online";

export const CHROME_EXTENSION_URL =
  process.env.NEXT_PUBLIC_CHROME_EXTENSION_URL?.trim() ||
  "https://chromewebstore.google.com/detail/studyflow-ai/abfdojlcmgdinibfjklpjlnigcghlcfp";

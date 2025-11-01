/**
 * Utility للتواصل مع Background Script لحل مشكلة CORS
 */

export interface FetchResponse {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * التحقق إذا كان الكود يعمل في Extension context
 */
function isExtensionContext(): boolean {
  return (
    typeof chrome !== "undefined" &&
    chrome.runtime &&
    chrome.runtime.id !== undefined
  );
}

/**
 * عمل fetch عبر background script لتجاوز CORS
 * في dev mode يستخدم fetch عادي
 */
export async function backgroundFetch(
  url: string,
  options?: RequestInit
): Promise<string> {
  // في dev mode استخدم fetch عادي
  if (!isExtensionContext()) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  }

  // في Extension استخدم background script
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "FETCH_URL",
        url,
        options,
      },
      (response: FetchResponse) => {
        if (response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || "Unknown error"));
        }
      }
    );
  });
}

/**
 * تحميل فونت عبر background script وإرجاعه كـ Base64
 * في dev mode يستخدم fetch عادي
 */
export async function backgroundFetchFont(url: string): Promise<string> {
  // في dev mode استخدم fetch عادي
  if (!isExtensionContext()) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // في Extension استخدم background script
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "FETCH_FONT",
        url,
      },
      (response: FetchResponse) => {
        if (response.success && response.data) {
          resolve(response.data);
        } else {
          reject(new Error(response.error || "Unknown error"));
        }
      }
    );
  });
}

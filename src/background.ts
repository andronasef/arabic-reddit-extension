// Background Service Worker لحل مشكلة CORS

// معالجة طلبات fetch من popup/content scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === "FETCH_URL") {
    // استخدام fetch في background لتجاوز CORS
    fetch(request.url, request.options || {})
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => {
        sendResponse({ success: true, data });
      })
      .catch((error) => {
        console.error("Background fetch error:", error);
        sendResponse({ success: false, error: error.message });
      });

    // إرجاع true للإشارة إلى استخدام sendResponse بشكل async
    return true;
  }

  if (request.type === "FETCH_FONT") {
    // تحميل الفونت كـ ArrayBuffer
    fetch(request.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then((arrayBuffer) => {
        // تحويل ArrayBuffer إلى Base64
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        sendResponse({ success: true, data: base64 });
      })
      .catch((error) => {
        console.error("Background fetch font error:", error);
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});

// Log when service worker is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("Arabic Reddit Extension installed");
});

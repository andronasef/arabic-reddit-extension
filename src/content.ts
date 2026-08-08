import { FontSettings } from "./types/fonts";

function logger(text: string) {
  console.log(`Arabic Reddit: ${text}`);
}

function addStyle(styleString: string) {
  const style = document.createElement("style");
  style.textContent = styleString;
  document.head.append(style);
}

/**
 * تطبيق الفونت من Base64
 */
function applyCustomFonts(settings: FontSettings) {
  logger("Applying custom fonts");
  console.log("Font settings to apply:", {
    arabicFont: settings.arabicFont?.name,
    hasArabicBase64: !!settings.arabicFont?.base64,
    englishFont: settings.englishFont?.name,
    hasEnglishBase64: !!settings.englishFont?.base64,
  });

  let fontFaceStyles = "";
  const fontFamilies: string[] = [];

  // إضافة الفونت العربي
  if (settings.arabicFont && settings.arabicFont.name !== "default") {
    if (settings.arabicFont.base64) {
      // فونت مخصص (Base64)
      fontFaceStyles += `
        @font-face {
          font-family: 'CustomArabicFont';
          src: url('${settings.arabicFont.base64}') format('${
        settings.arabicFont.format || "woff2"
      }');
          font-display: swap;
          unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
        }
      `;
      fontFamilies.push("CustomArabicFont");
    } else {
      // فونت من Google Fonts (بدون Base64)
      addStyle(
        `@import url('https://fonts.googleapis.com/css2?family=${settings.arabicFont.name
          .split(" ")
          .join("+")}&display=swap');`
      );
      fontFamilies.push(`'${settings.arabicFont.name}'`);
    }
  }

  // إضافة الفونت الإنجليزي
  if (settings.englishFont && settings.englishFont.name !== "default") {
    if (settings.englishFont.base64) {
      // فونت مخصص (Base64)
      fontFaceStyles += `
        @font-face {
          font-family: 'CustomEnglishFont';
          src: url('${settings.englishFont.base64}') format('${
        settings.englishFont.format || "woff2"
      }');
          font-display: swap;
          unicode-range: U+0020-007F, U+00A0-00FF, U+0100-017F;
        }
      `;
      fontFamilies.push("CustomEnglishFont");
    } else {
      // فونت من Google Fonts (بدون Base64)
      addStyle(
        `@import url('https://fonts.googleapis.com/css2?family=${settings.englishFont.name
          .split(" ")
          .join("+")}&display=swap');`
      );
      fontFamilies.push(`'${settings.englishFont.name}'`);
    }
  }

  // إضافة @font-face styles
  if (fontFaceStyles) {
    addStyle(fontFaceStyles);
  }

  // تطبيق الفونتات على الصفحة
  if (fontFamilies.length > 0) {
    const fontFamily = fontFamilies.join(", ") + ", sans-serif";
    addStyle(`
      * {
        font-family: ${fontFamily} !important;
      }
    `);
  }
}

/**
 * إضافة فونت افتراضي من Google Fonts
 */
function addFont(fontName: string) {
  // البحث عن الفونت إذا كان موجود مسبقاً
  const fonts = document.querySelectorAll("style");
  for (const font of fonts) {
    if (font.textContent?.includes(fontName)) {
      return;
    }
  }

  logger(`addFont: ${fontName}`);
  addStyle(`
    @import url('https://fonts.googleapis.com/css2?family=${fontName
      .split(" ")
      .join("+")}&display=swap');
      p {
          overflow:hidden;
      }
      * {
          font-family: ${fontName}, sans-serif !important;
      }
      `);
}

/**
 * إصلاح اتجاه النص
 */
function fixDir() {
  logger(`fixing dir`);

  addStyle(`
  /* إصلاح اتجاه النص للعناوين والفقرات - استخدام unicode-bidi فقط */
  p, h1, h2, h3, h4, h5, h6 {
    unicode-bidi: plaintext !important;
    text-align: right !important;
  }
  
  /* عناوين المنشورات - unicode-bidi plaintext يكتشف الاتجاه تلقائياً */
  shreddit-post a[slot="title"],
  shreddit-post a[id^="post-title-"],
  shreddit-post [slot="title"],
  a.block.text-neutral-content-strong {
    unicode-bidi: plaintext !important;
    text-align: right !important;
    display: block !important;
  }
  
  /* محتوى المنشورات */
  shreddit-post-text-body,
  shreddit-post-text-body div,
  shreddit-post-text-body [slot="text-body"],
  div[id$="-post-rtjson-content"],
  .md.feed-card-text-preview,
  div[class*="feed-card-text-preview"] {
    unicode-bidi: plaintext !important;
    text-align: right !important;
  }
  
  /* الفقرات داخل المحتوى */
  shreddit-post-text-body p,
  div[id$="-post-rtjson-content"] p,
  .md p,
  shreddit-post p {
    unicode-bidi: plaintext !important;
    text-align: right !important;
    display: block !important;
  }
  
  /* التعليقات */
  [slot="comment"],
  [slot="comment"] p,
  .Comment,
  [data-testid="comment"],
  [data-testid="comment"] p {
    unicode-bidi: plaintext !important;
    text-align: right !important;
  }
  `);
}

/**
 * تحميل وتطبيق إعدادات الفونت
 */
async function loadAndApplyFonts() {
  try {
    // التحقق إذا كان chrome.storage متاح
    const isExtension =
      typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;

    let settings: FontSettings | null = null;

    if (isExtension) {
      const result = await chrome.storage.local.get("fontSettings");
      settings = result.fontSettings || null;
    } else {
      // في dev mode (لن يحدث عادةً لأن content script يعمل في Extension فقط)
      const data = localStorage.getItem("fontSettings");
      settings = data ? JSON.parse(data) : null;
    }

    if (settings && (settings.arabicFont || settings.englishFont)) {
      logger("Found custom font settings");
      console.log("Settings:", settings);
      applyCustomFonts(settings);
    } else {
      // استخدام الفونت الافتراضي
      logger("Using default font");
      addFont("Noto Sans Arabic");
    }

    // إصلاح اتجاه النص دائماً
    fixDir();
  } catch (error) {
    console.error("Error loading font settings:", error);
    // Fallback للفونت الافتراضي في حالة الخطأ
    addFont("Noto Sans Arabic");
    fixDir();
  }
}

// بدء التطبيق
loadAndApplyFonts();

/**
 * التحقق إذا كان النص يحتوي على حروف عربية
 */
function hasArabic(text: string): boolean {
  const arabicRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
}

/**
 * تطبيق RTL على عنصر إذا كان يحتوي على عربي
 */
function applyRTLIfArabic(element: HTMLElement) {
  const text = element.textContent || "";
  if (hasArabic(text)) {
    element.style.direction = "rtl";
    element.style.textAlign = "right";
  }
}

/**
 * إجبار الاتجاه RTL على العناوين والمحتوى العربي فقط
 */
function forceRTLDirection() {
  // عناوين المنشورات - فقط العربي
  const titles = document.querySelectorAll(
    'shreddit-post a[slot="title"], a[id^="post-title-"]'
  );
  titles.forEach((el) => {
    applyRTLIfArabic(el as HTMLElement);
  });

  // محتوى المنشورات - فقط العربي
  const contents = document.querySelectorAll(
    'shreddit-post-text-body, div[id$="-post-rtjson-content"], .feed-card-text-preview'
  );
  contents.forEach((el) => {
    applyRTLIfArabic(el as HTMLElement);
  });

  // جميع الفقرات في المنشورات - فقط العربي
  const paragraphs = document.querySelectorAll(
    "shreddit-post p, shreddit-post-text-body p"
  );
  paragraphs.forEach((el) => {
    applyRTLIfArabic(el as HTMLElement);
  });

  // التعليقات - فقط العربي
  const comments = document.querySelectorAll(
    '[slot="comment"], [slot="comment"] p'
  );
  comments.forEach((el) => {
    applyRTLIfArabic(el as HTMLElement);
  });
}

// تشغيل مباشرة
forceRTLDirection();

// إعادة التشغيل عند تحميل المحتوى
setTimeout(forceRTLDirection, 500);
setTimeout(forceRTLDirection, 1000);
setTimeout(forceRTLDirection, 2000);

// مراقبة التغييرات في الصفحة
const observer = new MutationObserver(() => {
  forceRTLDirection();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// الاستماع للتغييرات في الإعدادات
if (typeof chrome !== "undefined" && chrome.storage) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.fontSettings) {
      logger("Font settings changed, reloading...");
      console.log("New settings:", changes.fontSettings.newValue);
      location.reload();
    }
  });
}

import { FontData, FontSettings } from "../types/fonts";

const STORAGE_KEY = "fontSettings";
const FONT_CACHE_KEY = "fontCache";

/**
 * التحقق إذا كان chrome.storage متاح
 */
function isStorageAvailable(): boolean {
  return (
    typeof chrome !== "undefined" &&
    chrome.storage &&
    chrome.storage.local !== undefined
  );
}

/**
 * حفظ إعدادات الفونتات
 */
export async function saveFontSettings(settings: FontSettings): Promise<void> {
  try {
    if (isStorageAvailable()) {
      await chrome.storage.local.set({ [STORAGE_KEY]: settings });
      console.log("Font settings saved:", settings);
    } else {
      // في dev mode استخدم localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      console.log("Font settings saved to localStorage (dev mode):", settings);
    }
  } catch (error) {
    console.error("Error saving font settings:", error);
    throw error;
  }
}

/**
 * قراءة إعدادات الفونتات
 */
export async function loadFontSettings(): Promise<FontSettings | null> {
  try {
    if (isStorageAvailable()) {
      const result = await chrome.storage.local.get(STORAGE_KEY);
      return result[STORAGE_KEY] || null;
    } else {
      // في dev mode استخدم localStorage
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    }
  } catch (error) {
    console.error("Error loading font settings:", error);
    return null;
  }
}

/**
 * حذف إعدادات الفونتات
 */
export async function clearFontSettings(): Promise<void> {
  try {
    if (isStorageAvailable()) {
      await chrome.storage.local.remove(STORAGE_KEY);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error clearing font settings:", error);
    throw error;
  }
}

/**
 * حفظ فونت في الكاش
 */
export async function cacheFontData(
  fontName: string,
  fontData: FontData
): Promise<void> {
  try {
    if (isStorageAvailable()) {
      const result = await chrome.storage.local.get(FONT_CACHE_KEY);
      const cache = result[FONT_CACHE_KEY] || {};

      cache[fontName] = {
        ...fontData,
        cachedAt: Date.now(),
      };

      await chrome.storage.local.set({ [FONT_CACHE_KEY]: cache });
      console.log("Font cached:", fontName);
    } else {
      // في dev mode استخدم localStorage
      const cacheData = localStorage.getItem(FONT_CACHE_KEY);
      const cache = cacheData ? JSON.parse(cacheData) : {};

      cache[fontName] = {
        ...fontData,
        cachedAt: Date.now(),
      };

      localStorage.setItem(FONT_CACHE_KEY, JSON.stringify(cache));
      console.log("Font cached to localStorage (dev mode):", fontName);
    }
  } catch (error) {
    console.error("Error caching font:", error);
  }
}

/**
 * قراءة فونت من الكاش
 */
export async function getCachedFontData(
  fontName: string
): Promise<FontData | null> {
  try {
    let cache: any = {};

    if (isStorageAvailable()) {
      const result = await chrome.storage.local.get(FONT_CACHE_KEY);
      cache = result[FONT_CACHE_KEY] || {};
    } else {
      // في dev mode استخدم localStorage
      const cacheData = localStorage.getItem(FONT_CACHE_KEY);
      cache = cacheData ? JSON.parse(cacheData) : {};
    }

    const cachedFont = cache[fontName];
    if (!cachedFont) return null;

    // التحقق من أن الكاش ليس قديماً جداً (7 أيام)
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const age = Date.now() - cachedFont.cachedAt;

    if (age > maxAge) {
      // الكاش قديم، نحذفه
      delete cache[fontName];
      if (isStorageAvailable()) {
        await chrome.storage.local.set({ [FONT_CACHE_KEY]: cache });
      } else {
        localStorage.setItem(FONT_CACHE_KEY, JSON.stringify(cache));
      }
      return null;
    }

    return cachedFont;
  } catch (error) {
    console.error("Error getting cached font:", error);
    return null;
  }
}

/**
 * حذف كل الكاش
 */
export async function clearFontCache(): Promise<void> {
  try {
    if (isStorageAvailable()) {
      await chrome.storage.local.remove(FONT_CACHE_KEY);
      console.log("Font cache cleared");
    } else {
      localStorage.removeItem(FONT_CACHE_KEY);
      console.log("Font cache cleared from localStorage (dev mode)");
    }
  } catch (error) {
    console.error("Error clearing font cache:", error);
  }
}

/**
 * الحصول على حجم التخزين المستخدم
 */
export async function getStorageSize(): Promise<number> {
  try {
    if (isStorageAvailable()) {
      const result = await chrome.storage.local.get(null);
      const jsonString = JSON.stringify(result);
      // حساب الحجم بالبايت
      return new Blob([jsonString]).size;
    } else {
      // في dev mode احسب حجم localStorage
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length;
        }
      }
      return total;
    }
  } catch (error) {
    console.error("Error getting storage size:", error);
    return 0;
  }
}

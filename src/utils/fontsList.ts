import {
  ARABIC_GOOGLE_FONTS_FALLBACK,
  GOOGLE_FONTS_API_URL,
  GoogleFont,
} from "../types/fonts";
import { backgroundFetch } from "./backgroundFetch";

/**
 * جلب جميع الفونتات من Google Fonts Helper API
 */
export async function fetchAllGoogleFonts(): Promise<GoogleFont[]> {
  try {
    const data = await backgroundFetch(GOOGLE_FONTS_API_URL);
    const fonts: GoogleFont[] = JSON.parse(data);
    return fonts;
  } catch (error) {
    console.error("Error fetching Google Fonts:", error);
    throw error;
  }
}

/**
 * تصفية الفونتات العربية فقط
 */
export function filterArabicFonts(fonts: GoogleFont[]): GoogleFont[] {
  return fonts
    .filter((font) => font.subsets && font.subsets.includes("arabic"))
    .sort((a, b) => {
      // ترتيب حسب الشعبية (popularity) إذا كانت متوفرة
      if (a.popularity && b.popularity) {
        return a.popularity - b.popularity;
      }
      // ترتيب أبجدي كبديل
      return a.family.localeCompare(b.family);
    });
}

/**
 * تصفية الفونتات حسب اللغة/subset
 */
export function filterFontsBySubset(
  fonts: GoogleFont[],
  subset: string
): GoogleFont[] {
  return fonts
    .filter((font) => font.subsets && font.subsets.includes(subset))
    .sort((a, b) => {
      // ترتيب حسب الشعبية
      if (a.popularity && b.popularity) {
        return a.popularity - b.popularity;
      }
      return a.family.localeCompare(b.family);
    });
}

/**
 * الحصول على الفونتات العربية مع fallback للقائمة الثابتة
 */
export async function getArabicFonts(): Promise<string[]> {
  try {
    const allFonts = await fetchAllGoogleFonts();
    const arabicFonts = filterArabicFonts(allFonts);

    // إذا لم نجد فونتات، نستخدم القائمة الثابتة
    if (arabicFonts.length === 0) {
      console.warn("No Arabic fonts found from API, using fallback list");
      return ARABIC_GOOGLE_FONTS_FALLBACK;
    }

    return arabicFonts.map((font) => font.family);
  } catch (error) {
    console.error("Error getting Arabic fonts, using fallback:", error);
    return ARABIC_GOOGLE_FONTS_FALLBACK;
  }
}

/**
 * الحصول على فونتات لاتينية شائعة
 */
export async function getLatinFonts(): Promise<string[]> {
  try {
    const allFonts = await fetchAllGoogleFonts();
    const latinFonts = filterFontsBySubset(allFonts, "latin");

    // أخذ أول 50 فونت (الأكثر شعبية)
    return latinFonts.slice(0, 50).map((font) => font.family);
  } catch (error) {
    console.error("Error getting Latin fonts:", error);
    return [];
  }
}

/**
 * البحث عن فونت بالاسم
 */
export function searchFontByName(
  fonts: GoogleFont[],
  searchTerm: string
): GoogleFont[] {
  const lowerSearch = searchTerm.toLowerCase();
  return fonts.filter(
    (font) =>
      font.family.toLowerCase().includes(lowerSearch) ||
      font.id.includes(lowerSearch)
  );
}

/**
 * حفظ قائمة الفونتات في localStorage للكاش
 */
export function cacheFontsList(fonts: GoogleFont[], subset: string): void {
  try {
    const cacheKey = `fonts_cache_${subset}`;
    const cacheData = {
      fonts,
      cachedAt: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Error caching fonts list:", error);
  }
}

/**
 * قراءة قائمة الفونتات من localStorage
 */
export function getCachedFontsList(subset: string): GoogleFont[] | null {
  try {
    const cacheKey = `fonts_cache_${subset}`;
    const cached = localStorage.getItem(cacheKey);

    if (!cached) return null;

    const { fonts, cachedAt } = JSON.parse(cached);

    // الكاش صالح لمدة 7 أيام
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    const age = Date.now() - cachedAt;

    if (age > maxAge) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return fonts;
  } catch (error) {
    console.error("Error reading cached fonts:", error);
    return null;
  }
}

/**
 * الحصول على الفونتات مع الكاش
 */
export async function getArabicFontsWithCache(): Promise<string[]> {
  // محاولة القراءة من الكاش أولاً
  const cached = getCachedFontsList("arabic");

  if (cached && cached.length > 0) {
    console.log("Using cached Arabic fonts list");
    return cached.map((font) => font.family);
  }

  // إذا لم يوجد كاش، نجلب من الـ API
  try {
    const allFonts = await fetchAllGoogleFonts();
    const arabicFonts = filterArabicFonts(allFonts);

    // حفظ في الكاش
    if (arabicFonts.length > 0) {
      cacheFontsList(arabicFonts, "arabic");
      return arabicFonts.map((font) => font.family);
    }

    return ARABIC_GOOGLE_FONTS_FALLBACK;
  } catch (error) {
    console.error("Error fetching fonts, using fallback:", error);
    return ARABIC_GOOGLE_FONTS_FALLBACK;
  }
}

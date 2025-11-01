import { FontData } from "../types/fonts";
import { backgroundFetch, backgroundFetchFont } from "./backgroundFetch";

/**
 * الحصول على URL الفونت من Google Fonts
 */
export function getGoogleFontUrl(
  fontFamily: string,
  subset: string = "arabic"
): string {
  const formattedFamily = fontFamily.split(" ").join("+");
  return `https://fonts.googleapis.com/css2?family=${formattedFamily}&subset=${subset}&display=swap`;
}

/**
 * استخراج URL الفونت الفعلي من CSS
 */
export async function extractFontFileUrl(fontFamily: string): Promise<string> {
  const cssUrl = getGoogleFontUrl(fontFamily);

  try {
    const cssText = await backgroundFetch(cssUrl);

    // استخراج URL من src: url(...)
    const urlMatch = cssText.match(/src:\s*url\(([^)]+)\)/);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }

    throw new Error("Could not extract font URL from CSS");
  } catch (error) {
    console.error("Error extracting font URL:", error);
    throw error;
  }
}

/**
 * تحميل فونت من Google Fonts وتحويله لـ Base64
 */
export async function downloadGoogleFont(
  fontFamily: string
): Promise<FontData> {
  try {
    // الحصول على URL الفونت
    const fontUrl = await extractFontFileUrl(fontFamily);

    // تحميل الفونت كـ Base64 عبر background
    const base64Data = await backgroundFetchFont(fontUrl);

    // تحديد نوع الفونت
    const fontFormat = fontUrl.includes(".woff2")
      ? "woff2"
      : fontUrl.includes(".woff")
      ? "woff"
      : "ttf";

    return {
      name: fontFamily,
      base64: `data:font/${fontFormat};base64,${base64Data}`,
      type: "google",
      format: fontFormat,
      url: fontUrl,
    };
  } catch (error) {
    console.error("Error downloading Google font:", error);
    throw error;
  }
}

/**
 * التحقق من أن الفونت متاح في Google Fonts
 */
export function isValidGoogleFont(fontFamily: string): boolean {
  // يمكن إضافة validation أكثر تعقيداً هنا
  return fontFamily.length > 0;
}

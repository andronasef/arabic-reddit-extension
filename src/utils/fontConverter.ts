/**
 * تحويل الفونت من URL إلى Base64
 */
export async function fetchFontAsBase64(fontUrl: string): Promise<string> {
  try {
    const response = await fetch(fontUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching font:", error);
    throw error;
  }
}

/**
 * تحويل ملف فونت مرفوع إلى Base64
 */
export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // التحقق من نوع الملف
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const validExtensions = ["woff2", "woff", "ttf", "otf"];

    if (!validExtensions.includes(fileExtension || "")) {
      reject(
        new Error(
          "Invalid font file format. Please upload a .woff2, .woff, .ttf, or .otf file."
        )
      );
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * الحصول على format الفونت من Base64
 */
export function getFontFormat(
  base64: string
): "woff2" | "woff" | "ttf" | "otf" {
  if (base64.includes("font/woff2")) return "woff2";
  if (base64.includes("font/woff")) return "woff";
  if (base64.includes("font/ttf") || base64.includes("truetype")) return "ttf";
  if (base64.includes("font/otf") || base64.includes("opentype")) return "otf";

  // default fallback
  return "woff2";
}

/**
 * التحقق من حجم الملف (يجب أن يكون أقل من 5MB)
 */
export function validateFileSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
}

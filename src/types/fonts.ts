export interface FontData {
  name: string;
  base64?: string;
  url?: string;
  type: "google" | "custom";
  format?: "woff2" | "woff" | "ttf" | "otf";
}

export interface FontSettings {
  arabicFont: FontData | null;
  englishFont: FontData | null;
  fontSize?: number;
}

export interface GoogleFont {
  id: string;
  family: string;
  variants: string[];
  subsets: string[];
  category: string;
  version?: string;
  lastModified?: string;
  popularity?: number;
}

// API Response من Google Web Fonts Helper
export interface GoogleFontsApiResponse {
  items?: GoogleFont[];
}

// قائمة الفونتات العربية من Google Fonts (static fallback)
export const ARABIC_GOOGLE_FONTS_FALLBACK: string[] = [
  "Noto Sans Arabic",
  "Cairo",
  "Tajawal",
  "Almarai",
  "Amiri",
  "Scheherazade New",
  "Markazi Text",
  "Lateef",
  "Reem Kufi",
  "Lalezar",
  "Harmattan",
  "Mirza",
  "Katibeh",
  "Aref Ruqaa",
  "Rakkas",
  "Changa",
  "El Messiri",
  "Lemonada",
  "Vibes",
  "Mada",
  "Jomhuria",
  "Reem Kufi Ink",
  "Aref Ruqaa Ink",
  "Baloo Bhaijaan 2",
  "Kufam",
];

export const DEFAULT_ARABIC_FONT = "Noto Sans Arabic";
export const DEFAULT_ENGLISH_FONT = "system-ui";

// Google Fonts API URL
export const GOOGLE_FONTS_API_URL = "https://gwfh.mranftl.com/api/fonts/";

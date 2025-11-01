import { useState, useEffect } from "react";
import FontSelector from "./components/FontSelector";
import FontUploader from "./components/FontUploader";
import FontPreview from "./components/FontPreview";
import { FontData, FontSettings, DEFAULT_ARABIC_FONT } from "./types/fonts";
import { downloadGoogleFont } from "./utils/googleFontsApi";
import {
  saveFontSettings,
  loadFontSettings,
  getCachedFontData,
  cacheFontData,
} from "./utils/fontStorage";
import { getArabicFontsWithCache, getLatinFonts } from "./utils/fontsList";

type TabType = "arabic" | "english";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("arabic");
  const [arabicFont, setArabicFont] = useState<FontData | null>(null);
  const [englishFont, setEnglishFont] = useState<FontData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // قوائم الفونتات الديناميكية
  const [arabicFontsList, setArabicFontsList] = useState<string[]>([]);
  const [englishFontsList, setEnglishFontsList] = useState<string[]>([]);
  const [isFetchingFonts, setIsFetchingFonts] = useState(true);

  // تحميل الإعدادات والفونتات عند بدء التطبيق
  useEffect(() => {
    loadSettings();
    fetchFontsLists();
  }, []);

  const fetchFontsLists = async () => {
    setIsFetchingFonts(true);
    try {
      // جلب الفونتات العربية
      const arabicFonts = await getArabicFontsWithCache();
      setArabicFontsList(arabicFonts);

      // جلب الفونتات الإنجليزية
      const latinFonts = await getLatinFonts();
      setEnglishFontsList(latinFonts);

      console.log(
        `Loaded ${arabicFonts.length} Arabic fonts and ${latinFonts.length} Latin fonts`
      );
    } catch (error) {
      console.error("Error fetching fonts lists:", error);
      showMessage("error", "Failed to load fonts list. Using fallback fonts.");
    } finally {
      setIsFetchingFonts(false);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await loadFontSettings();
      if (settings) {
        setArabicFont(settings.arabicFont);
        setEnglishFont(settings.englishFont);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleArabicFontSelect = async (fontName: string) => {
    if (fontName === "default") {
      setArabicFont({ name: "default", type: "google" });
      return;
    }

    setIsLoading(true);
    try {
      // التحقق من الكاش أولاً
      const cachedFont = await getCachedFontData(fontName);
      if (cachedFont) {
        setArabicFont(cachedFont);
        showMessage("success", `Font loaded from cache: ${fontName}`);
        return;
      }

      // تحميل الفونت من Google
      const fontData = await downloadGoogleFont(fontName);
      setArabicFont(fontData);

      // حفظ في الكاش
      await cacheFontData(fontName, fontData);
      showMessage("success", `Arabic font downloaded: ${fontName}`);
    } catch (error) {
      console.error("Error downloading font:", error);
      showMessage("error", "Failed to download font. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnglishFontSelect = async (fontName: string) => {
    if (fontName === "default") {
      setEnglishFont({ name: "default", type: "google" });
      return;
    }

    setIsLoading(true);
    try {
      // التحقق من الكاش أولاً
      const cachedFont = await getCachedFontData(fontName);
      if (cachedFont) {
        setEnglishFont(cachedFont);
        showMessage("success", `Font loaded from cache: ${fontName}`);
        return;
      }

      // تحميل الفونت من Google
      const fontData = await downloadGoogleFont(fontName);
      setEnglishFont(fontData);

      // حفظ في الكاش
      await cacheFontData(fontName, fontData);
      showMessage("success", `English font downloaded: ${fontName}`);
    } catch (error) {
      console.error("Error downloading font:", error);
      showMessage("error", "Failed to download font. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArabicFontUpload = (fontData: FontData) => {
    setArabicFont(fontData);
    showMessage("success", `Custom Arabic font uploaded: ${fontData.name}`);
  };

  const handleEnglishFontUpload = (fontData: FontData) => {
    setEnglishFont(fontData);
    showMessage("success", `Custom English font uploaded: ${fontData.name}`);
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // التحقق من أن الفونتات محملة بالكامل (Base64)
      let finalArabicFont = arabicFont;
      let finalEnglishFont = englishFont;

      // إذا الفونت العربي مختار لكن بدون Base64، حمله
      if (arabicFont && arabicFont.name !== "default" && !arabicFont.base64) {
        showMessage("success", "Downloading Arabic font...");
        try {
          const cachedFont = await getCachedFontData(arabicFont.name);
          if (cachedFont) {
            finalArabicFont = cachedFont;
          } else {
            const fontData = await downloadGoogleFont(arabicFont.name);
            await cacheFontData(arabicFont.name, fontData);
            finalArabicFont = fontData;
          }
        } catch (error) {
          console.error("Error downloading Arabic font:", error);
          showMessage(
            "error",
            `Failed to download Arabic font: ${arabicFont.name}`
          );
          setIsSaving(false);
          return;
        }
      }

      // إذا الفونت الإنجليزي مختار لكن بدون Base64، حمله
      if (
        englishFont &&
        englishFont.name !== "default" &&
        !englishFont.base64
      ) {
        showMessage("success", "Downloading English font...");
        try {
          const cachedFont = await getCachedFontData(englishFont.name);
          if (cachedFont) {
            finalEnglishFont = cachedFont;
          } else {
            const fontData = await downloadGoogleFont(englishFont.name);
            await cacheFontData(englishFont.name, fontData);
            finalEnglishFont = fontData;
          }
        } catch (error) {
          console.error("Error downloading English font:", error);
          showMessage(
            "error",
            `Failed to download English font: ${englishFont.name}`
          );
          setIsSaving(false);
          return;
        }
      }

      // حفظ الإعدادات
      const settings: FontSettings = {
        arabicFont: finalArabicFont,
        englishFont: finalEnglishFont,
      };

      await saveFontSettings(settings);

      // تحديث الـ state بالفونتات المحملة
      setArabicFont(finalArabicFont);
      setEnglishFont(finalEnglishFont);

      showMessage("success", "Settings saved! Refresh Reddit to see changes.");
    } catch (error) {
      console.error("Error saving settings:", error);
      showMessage("error", "Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setArabicFont({ name: DEFAULT_ARABIC_FONT, type: "google" });
    setEnglishFont({ name: "default", type: "google" });
    showMessage("success", "Settings reset to default");
  };

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="min-w-[400px] max-w-[500px] bg-[#1A1A1B] text-[#D7DADC]">
      {/* Header */}
      <div className="bg-[#FE4502] p-4">
        <h1 className="font-bold text-xl text-white flex items-center gap-2">
          <img src="/icon.png" alt="Arabic Reddit" className="w-6 h-6" />
          Arabic Reddit Font Manager
        </h1>
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`px-4 py-3 ${
            message.type === "success"
              ? "bg-green-900/30 text-green-400"
              : "bg-red-900/30 text-red-400"
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            {message.type === "success" ? (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#343536] bg-[#1A1A1B]">
        <button
          onClick={() => setActiveTab("arabic")}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === "arabic"
              ? "text-[#FE4502] border-b-2 border-[#FE4502]"
              : "text-[#818384] hover:text-[#D7DADC]"
          }`}
        >
          Arabic Font
        </button>
        <button
          onClick={() => setActiveTab("english")}
          className={`flex-1 px-4 py-3 font-medium transition-colors ${
            activeTab === "english"
              ? "text-[#FE4502] border-b-2 border-[#FE4502]"
              : "text-[#818384] hover:text-[#D7DADC]"
          }`}
        >
          English Font
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
        {/* Loading Fonts Message */}
        {isFetchingFonts && (
          <div className="bg-[#272729] border border-[#343536] rounded p-3 flex items-center gap-2 text-sm text-[#D7DADC]">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FE4502]"></div>
            <span>Loading fonts list...</span>
          </div>
        )}

        {activeTab === "arabic" ? (
          <>
            <FontSelector
              value={arabicFont?.name || ""}
              onChange={(name) => setArabicFont({ name, type: "google" })}
              onDownload={handleArabicFontSelect}
              isLoading={isLoading}
              label="Select Arabic Font from Google Fonts"
              fontsList={arabicFontsList}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#343536]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1A1A1B] px-2 text-[#818384]">OR</span>
              </div>
            </div>

            <FontUploader
              onUpload={handleArabicFontUpload}
              label="Upload Custom Arabic Font"
            />
          </>
        ) : (
          <>
            <FontSelector
              value={englishFont?.name || ""}
              onChange={(name) => setEnglishFont({ name, type: "google" })}
              onDownload={handleEnglishFontSelect}
              isLoading={isLoading}
              label="Select English Font from Google Fonts"
              fontsList={englishFontsList}
            />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#343536]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1A1A1B] px-2 text-[#818384]">OR</span>
              </div>
            </div>

            <FontUploader
              onUpload={handleEnglishFontUpload}
              label="Upload Custom English Font"
            />
          </>
        )}

        {/* Preview */}
        <div className="pt-2">
          <FontPreview arabicFont={arabicFont} englishFont={englishFont} />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-[#343536] p-4 bg-[#1A1A1B] space-y-2">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving || (!arabicFont && !englishFont)}
          className="w-full px-4 py-2 bg-[#FE4502] text-white rounded font-medium
                     hover:bg-[#ff5722] focus:outline-none focus:ring-2 focus:ring-[#FE4502] focus:ring-offset-2 focus:ring-offset-[#1A1A1B]
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </div>
          ) : (
            "Save & Apply"
          )}
        </button>

        <button
          onClick={handleReset}
          className="w-full px-4 py-2 bg-[#272729] text-[#D7DADC] rounded font-medium
                     hover:bg-[#343536] focus:outline-none focus:ring-2 focus:ring-[#343536] focus:ring-offset-2 focus:ring-offset-[#1A1A1B]
                     transition-colors"
        >
          Reset to Default
        </button>

        <div className="text-center text-xs text-[#818384] pt-2">
          Made with ❤️ by{" "}
          <a
            href="https://andronasef.github.io/links/1"
            className="text-[#FE4502] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            andronasef
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;

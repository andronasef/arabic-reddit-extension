import { useEffect, useRef } from "react";
import { FontData } from "../types/fonts";

interface FontPreviewProps {
  arabicFont: FontData | null;
  englishFont: FontData | null;
}

const PREVIEW_TEXTS = {
  arabic: "مرحباً بك في Reddit العربي. هذا مثال على النص العربي.",
  english: "Welcome to Arabic Reddit. This is an English text example.",
  mixed: "Reddit is the best مكان للنقاش and sharing ideas!",
};

export default function FontPreview({
  arabicFont,
  englishFont,
}: FontPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!previewRef.current) return;

    // إنشاء style tag للفونتات
    const styleElement = document.createElement("style");
    let styleContent = "";

    // إضافة الفونت العربي
    if (arabicFont?.base64) {
      styleContent += `
        @font-face {
          font-family: 'PreviewArabicFont';
          src: url('${arabicFont.base64}') format('${
        arabicFont.format || "woff2"
      }');
          unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
        }
      `;
    }

    // إضافة الفونت الإنجليزي
    if (englishFont?.base64) {
      styleContent += `
        @font-face {
          font-family: 'PreviewEnglishFont';
          src: url('${englishFont.base64}') format('${
        englishFont.format || "woff2"
      }');
          unicode-range: U+0020-007F, U+00A0-00FF, U+0100-017F;
        }
      `;
    }

    styleElement.textContent = styleContent;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [arabicFont, englishFont]);

  const getFontFamily = () => {
    const fonts: string[] = [];

    if (arabicFont?.base64) {
      fonts.push("PreviewArabicFont");
    } else if (arabicFont?.name && arabicFont.name !== "default") {
      fonts.push(arabicFont.name);
    }

    if (englishFont?.base64) {
      fonts.push("PreviewEnglishFont");
    } else if (englishFont?.name && englishFont.name !== "default") {
      fonts.push(englishFont.name);
    }

    fonts.push("sans-serif");

    return fonts.join(", ");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#D7DADC]">
          Live Preview
        </label>
        <div className="text-xs text-[#818384]">
          {arabicFont?.name || "No Arabic"} •{" "}
          {englishFont?.name || "No English"}
        </div>
      </div>

      <div
        ref={previewRef}
        className="bg-[#272729] border border-[#343536] rounded p-4 space-y-3"
        style={{ fontFamily: getFontFamily() }}
      >
        {/* معاينة النص العربي */}
        <div className="space-y-1">
          <div className="text-xs text-[#818384]">Arabic Text:</div>
          <p className="text-[#D7DADC] text-base" dir="rtl">
            {PREVIEW_TEXTS.arabic}
          </p>
        </div>

        {/* معاينة النص الإنجليزي */}
        <div className="space-y-1">
          <div className="text-xs text-[#818384]">English Text:</div>
          <p className="text-[#D7DADC] text-base">{PREVIEW_TEXTS.english}</p>
        </div>

        {/* معاينة النص المختلط */}
        <div className="space-y-1">
          <div className="text-xs text-[#818384]">Mixed Text:</div>
          <p className="text-[#D7DADC] text-base">{PREVIEW_TEXTS.mixed}</p>
        </div>

        {/* عرض أحجام مختلفة */}
        <div className="space-y-2 border-t border-[#343536] pt-3">
          <div className="text-xs text-[#818384]">Different Sizes:</div>
          <p className="text-[#D7DADC] text-sm">نص صغير - Small text</p>
          <p className="text-[#D7DADC] text-base">نص متوسط - Medium text</p>
          <p className="text-[#D7DADC] text-lg">نص كبير - Large text</p>
          <p className="text-[#D7DADC] text-xl font-bold">
            نص عريض - Bold text
          </p>
        </div>
      </div>
    </div>
  );
}

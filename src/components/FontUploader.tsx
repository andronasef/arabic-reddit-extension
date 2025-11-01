import { useRef, useState } from "react";
import {
  convertFileToBase64,
  validateFileSize,
  getFontFormat,
} from "../utils/fontConverter";
import { FontData } from "../types/fonts";

interface FontUploaderProps {
  onUpload: (fontData: FontData) => void;
  label?: string;
}

export default function FontUploader({
  onUpload,
  label = "Upload Custom Font",
}: FontUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    try {
      // التحقق من حجم الملف
      if (!validateFileSize(file)) {
        throw new Error("File size must be less than 5MB");
      }

      // تحويل الملف إلى Base64
      const base64 = await convertFileToBase64(file);
      const format = getFontFormat(base64);

      // استخراج اسم الفونت من اسم الملف (بدون الامتداد)
      const fontName = file.name.replace(/\.(woff2|woff|ttf|otf)$/i, "");

      const fontData: FontData = {
        name: fontName,
        base64,
        type: "custom",
        format,
      };

      onUpload(fontData);
      setUploadedFileName(file.name);
      setError("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload font";
      setError(errorMessage);
      setUploadedFileName("");
    } finally {
      setIsUploading(false);
      // إعادة تعيين input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#D7DADC]">{label}</label>

      <input
        ref={fileInputRef}
        type="file"
        accept=".woff2,.woff,.ttf,.otf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full px-4 py-2 bg-[#272729] border border-[#343536] rounded text-[#D7DADC] 
                   hover:bg-[#343536] focus:outline-none focus:border-[#FE4502] 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FE4502]"></div>
            <span>Uploading...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span>Choose Font File</span>
          </div>
        )}
      </button>

      {uploadedFileName && (
        <div className="flex items-center gap-2 text-xs text-green-500">
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
          <span>Uploaded: {uploadedFileName}</span>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-500 flex items-start gap-2">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <p className="text-xs text-[#818384]">
        Supported formats: .woff2, .woff, .ttf, .otf (max 5MB)
      </p>
    </div>
  );
}

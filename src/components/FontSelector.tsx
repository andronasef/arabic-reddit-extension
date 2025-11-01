import { useState, useEffect } from "react";

interface FontSelectorProps {
  value: string;
  onChange: (fontName: string) => void;
  onDownload: (fontName: string) => Promise<void>;
  isLoading?: boolean;
  label?: string;
  fontsList?: string[]; // قائمة الفونتات الديناميكية
}

export default function FontSelector({
  value,
  onChange,
  onDownload,
  isLoading = false,
  label = "Select Font",
  fontsList = [],
}: FontSelectorProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFonts, setFilteredFonts] = useState<string[]>([]);

  useEffect(() => {
    // تصفية الفونتات حسب البحث
    if (searchTerm) {
      const filtered = fontsList.filter((font) =>
        font.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFonts(filtered);
    } else {
      setFilteredFonts(fontsList);
    }
  }, [searchTerm, fontsList]);

  const handleFontChange = async (fontName: string) => {
    onChange(fontName);
    if (fontName && fontName !== "default") {
      setIsDownloading(true);
      try {
        await onDownload(fontName);
      } catch (error) {
        console.error("Error downloading font:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[#D7DADC]">{label}</label>

      {/* Search Input */}
      {fontsList.length > 10 && (
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search fonts..."
          className="w-full px-3 py-2 bg-[#272729] border border-[#343536] rounded text-[#D7DADC] text-sm
                     focus:outline-none focus:border-[#FE4502] placeholder-[#818384]"
        />
      )}

      {/* Font Select */}
      <select
        value={value}
        onChange={(e) => handleFontChange(e.target.value)}
        disabled={isLoading || isDownloading || fontsList.length === 0}
        className="w-full px-3 py-2 bg-[#272729] border border-[#343536] rounded text-[#D7DADC] 
                   focus:outline-none focus:border-[#FE4502] disabled:opacity-50 disabled:cursor-not-allowed
                   max-h-[200px]"
        size={1}
      >
        <option value="">Choose a font...</option>
        <option value="default">Default (System Font)</option>
        <optgroup label="Available Fonts">
          {filteredFonts.length > 0 ? (
            filteredFonts.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))
          ) : (
            <option disabled>No fonts found</option>
          )}
        </optgroup>
      </select>

      {/* Loading State */}
      {(isLoading || isDownloading) && (
        <div className="flex items-center gap-2 text-xs text-[#818384]">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#FE4502]"></div>
          <span>Downloading font...</span>
        </div>
      )}

      {/* Fonts Count */}
      {fontsList.length > 0 && (
        <div className="text-xs text-[#818384]">
          {filteredFonts.length} font{filteredFonts.length !== 1 ? "s" : ""}{" "}
          available
          {searchTerm && ` (filtered from ${fontsList.length})`}
        </div>
      )}
    </div>
  );
}

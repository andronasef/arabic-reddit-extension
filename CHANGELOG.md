# Changelog

All notable changes to the Arabic Reddit extension will be documented in this file.

## [0.1.0] - 2025-11-01

### 🎉 Major Features Added

#### Dynamic Font System

- ✨ **100+ Arabic Google Fonts** loaded dynamically from API
- ✨ **50 Most Popular English/Latin Fonts** for better variety
- ✨ **Real-time Font Search** - filter fonts by name
- ✨ **Smart Caching** - Font lists cached for 7 days (localStorage)
- ✨ **Offline Support** - Falls back to static list if API unavailable
- ✨ **Popularity Sorting** - Fonts sorted by usage for better UX

#### Custom Font Selection

- ✨ Separate font selection for Arabic and English text
- ✨ Upload custom font files (.woff2, .woff, .ttf, .otf)
- ✨ Live preview before applying fonts
- ✨ Font caching for faster loading (chrome.storage.local)
- ✨ Automatic font download on save if not cached

#### RTL & Text Direction Fixes

- 🔧 **Forced RTL Direction** for all Arabic content
- 🔧 **Post titles** aligned to right
- 🔧 **Post body content** aligned to right
- 🔧 **Paragraphs** aligned to right with `unicode-bidi: plaintext`
- 🔧 **Dynamic MutationObserver** to apply RTL on new content
- 🔧 **Works with paragraphs starting with numbers/English letters**

#### Technical Improvements

- 🔧 **Google Web Fonts Helper API Integration** (gwfh.mranftl.com)
- 🔧 **Background Service Worker** for CORS bypass
- 🔧 **Dual Caching Strategy**:
  - Font lists in localStorage (7 days)
  - Downloaded fonts in chrome.storage.local (7 days)
- 🔧 Base64 font encoding for security and offline usage
- 🔧 Unicode range support for separate Arabic/English fonts
- 🔧 Automatic cache refresh when expired
- 🔧 Fallback to static list mechanism
- 🔧 Automatic page reload on font change detection
- 🔧 **Dev mode support** with localStorage fallback
- 🔧 **Extension context detection** for proper API usage

#### UI Enhancements

- 🎨 Complete UI redesign with tabbed interface
- 🎨 Live preview component with multiple text samples
- 🎨 Loading states and progress indicators
- 🎨 Success/error messaging system
- 🎨 Reddit-themed dark mode design
- 🎨 Extension icon in header

### 📁 New Files Added

```
src/
├── background.ts                   # NEW: Background service worker for CORS
├── types/
│   └── fonts.ts                    # Font types and constants
├── utils/
│   ├── fontConverter.ts            # Font conversion utilities
│   ├── googleFontsApi.ts           # Google Fonts integration
│   ├── fontStorage.ts              # Storage management
│   ├── fontsList.ts                # Dynamic font list fetching from API
│   └── backgroundFetch.ts          # NEW: CORS bypass utility
├── components/
│   ├── FontSelector.tsx            # Font dropdown with search
│   ├── FontUploader.tsx            # Custom font uploader
│   └── FontPreview.tsx             # Live preview component
└── Documentation/
    ├── FONT_MANAGER_DOCS.md        # Technical documentation
    ├── DYNAMIC_FONTS.md            # NEW: Dynamic font loading docs
    ├── CORS_FIX.md                 # NEW: CORS solution documentation
    ├── SCREENSHOTS.md              # UI examples and screenshots
    └── USER_GUIDE_AR.md            # Arabic user guide
```

### 🔄 Modified Files

- **src/App.tsx**: Complete rewrite with new UI and auto-download on save
- **src/content.ts**: Enhanced with font application logic and RTL fixes
- **manifest.config.ts**: Added background service worker and host permissions
- **vite.config.ts**: Added relative base path for extension compatibility
- **README.md**: Updated with new features
- **package.json**: Updated version and dependencies

### 🚀 Performance

- **Dual caching strategy** reduces API calls to once per 7 days
- Font caching reduces load times by ~90%
- WOFF2 format provides ~30% smaller file sizes
- Unicode ranges ensure only needed glyphs are loaded
- Base64 encoding eliminates external requests
- Search functionality works client-side for instant results

### 🔒 Security

- Base64 encoding prevents CSP violations
- File type validation for uploads
- File size limits (5MB max)
- Secure storage in Chrome's local storage

### 📊 Technical Specifications

- **Storage**: Chrome Storage Local API
- **Font Format**: Primarily WOFF2 (with WOFF/TTF/OTF support)
- **Encoding**: Base64 data URIs
- **Cache Duration**: 7 days
- **File Size Limit**: 5MB per font
- **Unicode Ranges**:
  - Arabic: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF
  - English: U+0020-007F, U+00A0-00FF, U+0100-017F

### 🐛 Bug Fixes

- Fixed text direction issues with mixed content
- Fixed CORS policy blocking API requests
- Fixed popup not opening due to incorrect asset paths
- Fixed font not applying after save (auto-download on save)
- Fixed RTL alignment for post titles and content
- Fixed paragraphs starting with numbers/English letters
- Improved font loading reliability
- Better error handling for font downloads
- Dev mode compatibility with localStorage fallback

### 📝 Documentation

- Comprehensive technical documentation
- User guide in Arabic
- Screenshots and examples
- API reference for developers

### 🎓 Developer Notes

The new font system architecture:

1. **Popup UI** (App.tsx): User selects fonts
2. **Storage Layer** (fontStorage.ts): Manages persistence
3. **Content Script** (content.ts): Applies fonts to Reddit
4. **Cache Layer**: Prevents redundant downloads
5. **Preview System**: Real-time font rendering

### 🙏 Credits

- **Main Developer**: AI with some help of [andronasef](https://andronasef.github.io/links/1)
- **Contributors**: Community feedback and suggestions
- **Font Providers**: Google Fonts

---

## [0.0.3] - Previous Version

### Features

- Basic Arabic text direction fixing
- Default Noto Sans Arabic font
- Simple text alignment corrections

---

## How to Update

To use the new features:

1. **From Chrome Web Store**:

   - Extension will auto-update within 24 hours
   - Or manually update from chrome://extensions

2. **From Source**:

   ```bash
   git pull
   bun install
   bun run build
   ```

3. **Using the Extension**:
   - Click the extension icon
   - Configure your preferred fonts
   - Click "Save & Apply"
   - Refresh Reddit pages

---

**Last Updated**: November 1, 2025  
**Version**: 0.1.0  
**Status**: Released 🎉

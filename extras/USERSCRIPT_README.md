# Arabic Reddit Userscript

Advanced font manager userscript for Reddit with full UI support.

## Features

✨ **All Extension Features** - Complete parity with the Chrome Extension

- 🔤 **Dynamic Font Loading** - 100+ Arabic fonts, 50 Latin fonts from Google Fonts API
- 🎨 **Beautiful UI** - Reddit-themed floating panel with tabs
- 🔍 **Search Functionality** - Quick font search in both Arabic and English tabs
- 💾 **Persistent Storage** - Saves your font preferences using GM storage
- ⚡ **Smart Caching** - 7-day font list cache for faster loading
- 🔄 **RTL Auto-Detection** - Only Arabic content gets RTL direction
- 📱 **Responsive Design** - Works perfectly on all screen sizes

## Installation

### Prerequisites

- [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge, Safari)
- [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/) (Firefox)
- [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

### Steps

1. Install one of the userscript managers above
2. Click on `arabic-reddit.user.js` file
3. Your userscript manager will prompt you to install
4. Click "Install" and you're done!

## Usage

### Opening the Panel

- Look for the 🔤 button in the top-right of Reddit pages
- Click it to open/close the font manager panel

### Selecting Fonts

1. Switch between **Arabic Font** and **English Font** tabs
2. Use the search box to quickly find fonts
3. Select your preferred font from the dropdown
4. Click **Save & Apply**
5. Page will auto-refresh to apply changes

### Supported Reddit URLs

- https://www.reddit.com/*
- https://_.reddit.com/_

## Technical Details

### API

- **Font Source**: [Google Web Fonts Helper](https://gwfh.mranftl.com/api/fonts/)
- **Cache Duration**: 7 days
- **Storage**: GM_setValue/GM_getValue (with localStorage fallback)

### Font Filtering

- **Arabic Fonts**: All fonts with `arabic` subset, sorted by popularity
- **Latin Fonts**: Top 50 fonts with `latin` subset, sorted by popularity

### RTL Detection

- Uses Unicode range detection for Arabic characters
- Only applies RTL to content containing Arabic text
- Preserves LTR for English/Latin content

### Performance

- Fonts are loaded directly from Google Fonts CDN
- API responses are cached for 7 days
- Lazy loading for better initial page load

## Comparison with Extension

| Feature        | Extension | Userscript |
| -------------- | --------- | ---------- |
| Dynamic Fonts  | ✅        | ✅         |
| UI Panel       | ✅        | ✅         |
| Search         | ✅        | ✅         |
| Tabs           | ✅        | ✅         |
| RTL Detection  | ✅        | ✅         |
| Caching        | ✅        | ✅         |
| Custom Upload  | ✅        | ❌         |
| Preview        | ✅        | ❌         |
| Browser Action | ✅        | ❌         |

## Development

### File Structure

```
extras/
  ├── arabic-reddit.user.js    # Main userscript
  └── USERSCRIPT_README.md     # This file
```

### Userscript Header

```javascript
// @name           Arabic Reddit - Advanced Font Manager
// @version        2.0.0
// @description    Full-featured font manager with UI for Reddit Arabic content
// @match          https://www.reddit.com/*
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
```

### Key Functions

- `createUI()` - Creates floating button and panel
- `initUI()` - Loads fonts and sets up event listeners
- `applyFont()` - Applies selected font to page
- `forceRTLDirection()` - Applies RTL to Arabic content
- `getArabicFonts()` / `getLatinFonts()` - Fetches and caches font lists

## Troubleshooting

### Panel doesn't appear

- Make sure the script is enabled in your userscript manager
- Check browser console for errors
- Try refreshing the page

### Fonts not loading

- Check your internet connection
- Clear cache and refresh
- Font API might be temporarily down

### Fonts not applying

- Click "Save & Apply" button
- Wait for page to auto-refresh
- Check that you selected a font (not "Default Font")

### Storage issues

- Make sure GM_getValue/GM_setValue permissions are granted
- Check userscript manager settings
- Try clearing browser cache

## Contributing

This userscript is part of the Arabic Reddit Extension project.

### Reporting Issues

Please report issues on the main project repository.

### Adding Features

Fork the repo, make changes, and submit a PR!

## License

Same as main project license.

## Credits

- **Author**: andronasef.dev
- **Font API**: [Google Web Fonts Helper](https://gwfh.mranftl.com/)
- **Inspiration**: Arabic Reddit Extension

## Changelog

### v2.0.0 (Current)

- ✨ Complete rewrite with full UI
- 🎨 Added floating panel with tabs
- 🔍 Added search functionality
- 💾 Added persistent storage
- ⚡ Added font caching
- 🔄 Smart RTL detection

### v1.0.0 (Legacy)

- Basic RTL fixes
- Default Noto Sans Arabic font
- No UI or customization

---

**Enjoy using Arabic Reddit Userscript! 🔤✨**

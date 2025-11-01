// ==UserScript==
// @name           Arabic Reddit - Advanced Font Manager
// @version        2.0.0
// @description    Full-featured font manager with UI for Reddit Arabic content
// @author         andronasef.dev
// @match          https://www.reddit.com/*
// @match          https://*.reddit.com/*
// @icon           https://www.google.com/s2/favicons?domain=reddit.com&sz=128
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @run-at         document-end
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEYS = {
    ARABIC_FONT: "arabic_reddit_arabic_font",
    ENGLISH_FONT: "arabic_reddit_english_font",
    CUSTOM_FONTS: "arabic_reddit_custom_fonts",
  };

  // Static list of popular Arabic fonts
  const ARABIC_FONTS = [
    { name: "Amiri", family: "Amiri" },
    { name: "Cairo", family: "Cairo" },
    { name: "Tajawal", family: "Tajawal" },
    { name: "Lateef", family: "Lateef" },
    { name: "Scheherazade New", family: "Scheherazade New" },
    { name: "Reem Kufi", family: "Reem Kufi" },
    { name: "Harmattan", family: "Harmattan" },
    { name: "Aref Ruqaa", family: "Aref Ruqaa" },
    { name: "Changa", family: "Changa" },
    { name: "El Messiri", family: "El Messiri" },
    { name: "Almarai", family: "Almarai" },
    { name: "Lalezar", family: "Lalezar" },
    { name: "Rakkas", family: "Rakkas" },
    { name: "Mada", family: "Mada" },
    { name: "Katibeh", family: "Katibeh" },
  ];

  // Static list of popular English fonts
  const ENGLISH_FONTS = [
    { name: "Roboto", family: "Roboto" },
    { name: "Open Sans", family: "Open Sans" },
    { name: "Montserrat", family: "Montserrat" },
    { name: "Inter", family: "Inter" },
    { name: "Poppins", family: "Poppins" },
    { name: "Lato", family: "Lato" },
    { name: "Roboto Condensed", family: "Roboto Condensed" },
    { name: "Arimo", family: "Arimo" },
    { name: "Roboto Mono", family: "Roboto Mono" },
    { name: "Oswald", family: "Oswald" },
    { name: "Noto Sans", family: "Noto Sans" },
    { name: "Raleway", family: "Raleway" },
    { name: "Nunito", family: "Nunito" },
    { name: "Nunito Sans", family: "Nunito Sans" },
    { name: "Playfair Display", family: "Playfair Display" },
    { name: "Ubuntu", family: "Ubuntu" },
    { name: "Roboto Slab", family: "Roboto Slab" },
    { name: "Merriweather", family: "Merriweather" },
    { name: "DM Sans", family: "DM Sans" },
    { name: "Fjalla One", family: "Fjalla One" },
    { name: "Work Sans", family: "Work Sans" },
    { name: "PT Sans", family: "PT Sans" },
    { name: "Kanit", family: "Kanit" },
    { name: "Bricolage Grotesque", family: "Bricolage Grotesque" },
    { name: "Lora", family: "Lora" },
    { name: "Mulish", family: "Mulish" },
    { name: "Manrope", family: "Manrope" },
    { name: "Quicksand", family: "Quicksand" },
    { name: "Outfit", family: "Outfit" },
    { name: "Figtree", family: "Figtree" },
    { name: "Fira Sans", family: "Fira Sans" },
    { name: "Barlow", family: "Barlow" },
    { name: "IBM Plex Sans", family: "IBM Plex Sans" },
    { name: "Bebas Neue", family: "Bebas Neue" },
    { name: "Archivo Black", family: "Archivo Black" },
    { name: "Lobster Two", family: "Lobster Two" },
    { name: "Titillium Web", family: "Titillium Web" },
    { name: "Source Sans 3", family: "Source Sans 3" },
    { name: "Noto Serif", family: "Noto Serif" },
    { name: "Prompt", family: "Prompt" },
    { name: "PT Serif", family: "PT Serif" },
    { name: "Heebo", family: "Heebo" },
    { name: "Karla", family: "Karla" },
    { name: "Jost", family: "Jost" },
    { name: "Saira", family: "Saira" },
    { name: "Libre Baskerville", family: "Libre Baskerville" },
    { name: "Gravitas One", family: "Gravitas One" },
    { name: "Bungee", family: "Bungee" },
    { name: "Inconsolata", family: "Inconsolata" },
    { name: "Archivo", family: "Archivo" },
    { name: "Dancing Script", family: "Dancing Script" },
    { name: "Share Tech", family: "Share Tech" },
    { name: "Michroma", family: "Michroma" },
    { name: "Smooch Sans", family: "Smooch Sans" },
    { name: "Libre Franklin", family: "Libre Franklin" },
    { name: "Josefin Sans", family: "Josefin Sans" },
    { name: "Roboto Flex", family: "Roboto Flex" },
    { name: "Anton", family: "Anton" },
    { name: "EB Garamond", family: "EB Garamond" },
    { name: "Barlow Condensed", family: "Barlow Condensed" },
    { name: "Source Code Pro", family: "Source Code Pro" },
    { name: "Dosis", family: "Dosis" },
    { name: "Cabin", family: "Cabin" },
    { name: "Plus Jakarta Sans", family: "Plus Jakarta Sans" },
    { name: "Schibsted Grotesk", family: "Schibsted Grotesk" },
    { name: "Slabo 27px", family: "Slabo 27px" },
    { name: "Mukta", family: "Mukta" },
    { name: "Assistant", family: "Assistant" },
    { name: "Ramabhadra", family: "Ramabhadra" },
    { name: "Bitter", family: "Bitter" },
    { name: "Public Sans", family: "Public Sans" },
    { name: "Exo 2", family: "Exo 2" },
    { name: "M PLUS Rounded 1c", family: "M PLUS Rounded 1c" },
    { name: "Inter Tight", family: "Inter Tight" },
    { name: "Pacifico", family: "Pacifico" },
    { name: "Alfa Slab One", family: "Alfa Slab One" },
    { name: "Crimson Text", family: "Crimson Text" },
    { name: "Hind", family: "Hind" },
    { name: "Changa One", family: "Changa One" },
    { name: "Red Hat Display", family: "Red Hat Display" },
    { name: "Oxygen", family: "Oxygen" },
    { name: "Lobster", family: "Lobster" },
    { name: "Space Grotesk", family: "Space Grotesk" },
    { name: "PT Sans Narrow", family: "PT Sans Narrow" },
    { name: "Overpass", family: "Overpass" },
    { name: "Comfortaa", family: "Comfortaa" },
    { name: "Lexend", family: "Lexend" },
    { name: "Cormorant Garamond", family: "Cormorant Garamond" },
    { name: "Arvo", family: "Arvo" },
    { name: "Urbanist", family: "Urbanist" },
    { name: "Abel", family: "Abel" },
    { name: "Rajdhani", family: "Rajdhani" },
    { name: "Caveat", family: "Caveat" },
    { name: "DM Serif Display", family: "DM Serif Display" },
    { name: "Teko", family: "Teko" },
    { name: "Sora", family: "Sora" },
    { name: "Play", family: "Play" },
  ];

  const logger = {
    info: (msg) => console.log("[Arabic Reddit] " + msg),
    error: (msg, err) => console.error("[Arabic Reddit] " + msg, err),
  };

  function addStyle(styleString) {
    if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(styleString);
    } else {
      const style = document.createElement("style");
      style.textContent = styleString;
      document.head.appendChild(style);
    }
  }

  function saveToStorage(key, value) {
    try {
      if (typeof GM_setValue !== "undefined") {
        GM_setValue(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      logger.error("Error saving to storage:", e);
    }
  }

  function getFromStorage(key) {
    try {
      let data;
      if (typeof GM_getValue !== "undefined") {
        data = GM_getValue(key);
      } else {
        data = localStorage.getItem(key);
      }
      return data ? JSON.parse(data) : null;
    } catch (e) {
      logger.error("Error reading from storage:", e);
      return null;
    }
  }

  function hasArabic(text) {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
      text
    );
  }

  function applyRTLIfArabic(element) {
    if (!element) return;
    const text = element.textContent || "";
    if (hasArabic(text)) {
      element.style.direction = "rtl";
      element.style.textAlign = "right";
    }
  }

  function getCustomFonts() {
    return getFromStorage(STORAGE_KEYS.CUSTOM_FONTS) || [];
  }

  function saveCustomFont(fontName, fontData) {
    const customFonts = getCustomFonts();
    customFonts.push({ name: fontName, family: fontName, data: fontData });
    saveToStorage(STORAGE_KEYS.CUSTOM_FONTS, customFonts);
    return customFonts;
  }

  function loadGoogleFont(fontFamily) {
    const url =
      "https://fonts.googleapis.com/css2?family=" +
      fontFamily.split(" ").join("+") +
      "&display=swap";
    // Use GM_addStyle to bypass CSP restrictions
    addStyle("@import url('" + url + "');");
  }

  function loadCustomFont(fontName, fontData) {
    const style = document.createElement("style");
    style.textContent = `
        @font-face {
          font-family: '${fontName}';
          src: url('${fontData}');
        }
      `;
    document.head.appendChild(style);
  }

  function applyFont(fontName, fontData = null) {
    if (!fontName || fontName === "default") return;

    if (fontData) {
      // Custom uploaded font
      loadCustomFont(fontName, fontData);
    } else {
      // Google font
      loadGoogleFont(fontName);
    }

    // Apply font to all Reddit content
    addStyle(`
        body *:not(#arabic-reddit-panel):not(#arabic-reddit-panel *):not(#arabic-reddit-toggle) {
          font-family: '${fontName}', sans-serif !important;
        }
      `);
  }

  function forceRTLDirection() {
    const selectors = [
      "shreddit-post a[slot='title']",
      "a[id^='post-title-']",
      "shreddit-post-text-body",
      "div[id$='-post-rtjson-content']",
      ".feed-card-text-preview",
      "shreddit-post p",
      "shreddit-post-text-body p",
      "[slot='comment']",
      "[slot='comment'] p",
    ];
    document
      .querySelectorAll(selectors.join(","))
      .forEach((el) => applyRTLIfArabic(el));
  }

  function fixDir() {
    addStyle(`
        p, h1, h2, h3, h4, h5, h6 {
          unicode-bidi: plaintext !important;
          text-align: start !important;
        }
        shreddit-post a[slot="title"],
        shreddit-post a[id^="post-title-"],
        shreddit-post [slot="title"] {
          unicode-bidi: plaintext !important;
          text-align: start !important;
          display: block !important;
        }
        shreddit-post-text-body,
        shreddit-post-text-body p,
        div[id$="-post-rtjson-content"],
        div[id$="-post-rtjson-content"] p,
        [slot="comment"],
        [slot="comment"] p {
          unicode-bidi: plaintext !important;
          text-align: start !important;
        }
        /* Reddit Chat (Shadow DOM) */
        .room-message-body,
        .room-message-text,
        .last-message,
        .room-name,
        textarea,
        .user-name,
        [class*="message"],
        [class*="text"] {
          unicode-bidi: plaintext !important;
          text-align: start !important;
        }
      `);
  }

  function createUI() {
    addStyle(`
        #arabic-reddit-panel,
        #arabic-reddit-panel * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          box-sizing: border-box !important;
        }
        
        #arabic-reddit-panel {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: 700px !important;
          max-width: 90vw !important;
          max-height: 85vh !important;
          background: #1A1A1B !important;
          border: 1px solid #343536 !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.8) !important;
          z-index: 2147483647 !important;
          display: none !important;
          overflow: hidden !important;
          color: #D7DADC !important;
        }
        
        #arabic-reddit-panel.show { 
          display: block !important; 
        }
        
        #arabic-reddit-toggle {
          position: fixed !important;
          top: 60px !important;
          right: 20px !important;
          width: 48px !important;
          height: 48px !important;
          background: #FE4502 !important;
          border: none !important;
          border-radius: 50% !important;
          cursor: pointer !important;
          z-index: 2147483646 !important;
          font-size: 24px !important;
          line-height: 48px !important;
          color: white !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.4) !important;
          transition: all 0.3s ease !important;
          text-align: center !important;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }
        
        #arabic-reddit-toggle:hover { 
          background: #ff5722 !important;
          transform: scale(1.1) !important;
        }
        
        .ar-panel-header {
          background: #FE4502 !important;
          padding: 16px 20px !important;
          color: white !important;
          font-weight: 700 !important;
          font-size: 18px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
        }
        
        .ar-close-btn {
          background: transparent !important;
          border: none !important;
          color: white !important;
          font-size: 28px !important;
          line-height: 32px !important;
          cursor: pointer !important;
          padding: 0 !important;
          width: 32px !important;
          height: 32px !important;
          text-align: center !important;
          border-radius: 4px !important;
          transition: background 0.2s !important;
        }
        
        .ar-close-btn:hover {
          background: rgba(255,255,255,0.1) !important;
        }
        
        .ar-panel-tabs {
          display: flex !important;
          border-bottom: 1px solid #343536 !important;
          background: #1A1A1B !important;
        }
        
        .ar-panel-tab {
          flex: 1 !important;
          background: transparent !important;
          border: none !important;
          color: #818384 !important;
          cursor: pointer !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          border-bottom: 2px solid transparent !important;
          transition: all 0.2s ease !important;
        }
        
        .ar-panel-tab:hover { 
          color: #D7DADC !important; 
        }
        
        .ar-panel-tab.active { 
          color: #FE4502 !important;
          border-bottom-color: #FE4502 !important;
        }
        
        .ar-panel-content {
          padding: 24px !important;
          max-height: calc(85vh - 140px) !important;
          overflow-y: auto !important;
          background: #1A1A1B !important;
          display: block !important;
        }
        
        .ar-panel-content::-webkit-scrollbar { 
          width: 10px !important; 
        }
        
        .ar-panel-content::-webkit-scrollbar-track { 
          background: #1A1A1B !important; 
        }
        
        .ar-panel-content::-webkit-scrollbar-thumb { 
          background: #4A4A4B !important;
          border-radius: 5px !important;
        }
        
        .ar-panel-content::-webkit-scrollbar-thumb:hover { 
          background: #FE4502 !important; 
        }
        
        .ar-form-group { 
          margin-bottom: 20px !important;
          display: block !important;
        }
        
        .ar-label {
          display: block !important;
          color: #D7DADC !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          margin-bottom: 10px !important;
        }
        
        .ar-font-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
          gap: 12px !important;
          margin-top: 12px !important;
        }
        
        .ar-font-card {
          background: #272729 !important;
          border: 2px solid #343536 !important;
          border-radius: 8px !important;
          padding: 16px !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          position: relative !important;
        }
        
        .ar-font-card:hover {
          border-color: #FE4502 !important;
          background: #2F2F30 !important;
        }
        
        .ar-font-card.selected {
          border-color: #FE4502 !important;
          background: #2F2F30 !important;
        }
        
        .ar-font-card.selected::after {
          content: "✓" !important;
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
          background: #FE4502 !important;
          color: white !important;
          width: 24px !important;
          height: 24px !important;
          border-radius: 50% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 14px !important;
          font-weight: bold !important;
        }
        
        .ar-font-name {
          color: #D7DADC !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          margin-bottom: 8px !important;
        }
        
        .ar-font-preview {
          color: #A0A0A0 !important;
          font-size: 16px !important;
          line-height: 1.5 !important;
          margin: 0 !important;
        }
        
        .ar-upload-area {
          background: #272729 !important;
          border: 2px dashed #343536 !important;
          border-radius: 8px !important;
          padding: 24px !important;
          text-align: center !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          margin-bottom: 20px !important;
        }
        
        .ar-upload-area:hover {
          border-color: #FE4502 !important;
          background: #2F2F30 !important;
        }
        
        .ar-upload-area input[type="file"] {
          display: none !important;
        }
        
        .ar-upload-text {
          color: #818384 !important;
          font-size: 14px !important;
          margin-top: 8px !important;
        }
        
        .ar-select, .ar-input {
          width: 100% !important;
          padding: 10px 12px !important;
          background: #272729 !important;
          border: 1px solid #343536 !important;
          border-radius: 4px !important;
          color: #D7DADC !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          cursor: pointer !important;
          box-sizing: border-box !important;
        }
        
        .ar-select option {
          background: #272729 !important;
          color: #D7DADC !important;
          padding: 8px !important;
        }
        
        .ar-select:focus, .ar-input:focus { 
          outline: none !important;
          border-color: #FE4502 !important;
        }
        
        .ar-button {
          width: 100% !important;
          background: #FE4502 !important;
          color: white !important;
          border: none !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          line-height: 1.5 !important;
          cursor: pointer !important;
          transition: background 0.2s ease !important;
          text-align: center !important;
          box-sizing: border-box !important;
        }
        
        .ar-button:hover { 
          background: #ff5722 !important; 
        }
        
        .ar-message {
          padding: 12px !important;
          border-radius: 6px !important;
          margin-bottom: 20px !important;
          font-size: 14px !important;
          display: none !important;
        }
        
        .ar-message.success {
          background: rgba(76, 175, 80, 0.2) !important;
          color: #4CAF50 !important;
          border: 1px solid #4CAF50 !important;
          display: block !important;
        }
        
        .ar-message.error {
          background: rgba(244, 67, 54, 0.2) !important;
          color: #F44336 !important;
          border: 1px solid #F44336 !important;
          display: block !important;
        }
        
        .ar-tab-content { 
          display: none !important; 
        }
        
        .ar-tab-content.active { 
          display: block !important; 
        }
      `);

    const toggleBtn = document.createElement("button");
    toggleBtn.id = "arabic-reddit-toggle";
    toggleBtn.innerHTML = "🔤";
    toggleBtn.title = "Arabic Reddit Font Manager";
    document.body.appendChild(toggleBtn);

    const panel = document.createElement("div");
    panel.id = "arabic-reddit-panel";
    panel.innerHTML = `
        <div class="ar-panel-header">
          <span>🔤 Arabic Reddit Font Manager</span>
          <button class="ar-close-btn" id="ar-close-btn">×</button>
        </div>
        <div class="ar-panel-tabs">
          <button class="ar-panel-tab active" data-tab="arabic">Arabic Font</button>
          <button class="ar-panel-tab" data-tab="english">English Font</button>
        </div>
        <div class="ar-panel-content">
          <div id="ar-message" class="ar-message"></div>
          <div id="ar-arabic-tab" class="ar-tab-content active">
            <div class="ar-form-group">
              <label class="ar-label">Upload Custom Font</label>
              <div class="ar-upload-area" id="ar-arabic-upload">
                <div style="font-size: 32px;">📁</div>
                <div class="ar-upload-text">Click to upload .ttf or .otf font file</div>
                <input type="file" id="ar-arabic-file" accept=".ttf,.otf,.woff,.woff2" />
              </div>
            </div>
            <div class="ar-form-group">
              <label class="ar-label">Select Arabic Font</label>
              <div class="ar-font-grid" id="ar-arabic-grid"></div>
            </div>
          </div>
          <div id="ar-english-tab" class="ar-tab-content">
            <div class="ar-form-group">
              <label class="ar-label">Upload Custom Font</label>
              <div class="ar-upload-area" id="ar-english-upload">
                <div style="font-size: 32px;">📁</div>
                <div class="ar-upload-text">Click to upload .ttf or .otf font file</div>
                <input type="file" id="ar-english-file" accept=".ttf,.otf,.woff,.woff2" />
              </div>
            </div>
            <div class="ar-form-group">
              <label class="ar-label">Select English Font</label>
              <div class="ar-font-grid" id="ar-english-grid"></div>
            </div>
          </div>
          <button id="ar-save-btn" class="ar-button">Save & Apply</button>
        </div>
      `;
    document.body.appendChild(panel);

    toggleBtn.addEventListener("click", () => panel.classList.toggle("show"));

    const closeBtn = document.getElementById("ar-close-btn");
    closeBtn.addEventListener("click", () => panel.classList.remove("show"));

    document.querySelectorAll(".ar-panel-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document
          .querySelectorAll(".ar-panel-tab")
          .forEach((t) => t.classList.remove("active"));
        document
          .querySelectorAll(".ar-tab-content")
          .forEach((c) => c.classList.remove("active"));
        tab.classList.add("active");
        document
          .getElementById("ar-" + tab.dataset.tab + "-tab")
          .classList.add("active");
      });
    });
  }

  function renderFontGrid(gridId, fonts, previewText, selectedFont) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    // Load all Google fonts for preview
    fonts.forEach((font) => loadGoogleFont(font.family));

    // Add default option
    let html = `
        <div class="ar-font-card ${
          selectedFont === "default" ? "selected" : ""
        }" data-font="default">
          <div class="ar-font-name">Default Font</div>
        </div>
      `;

    // Add font cards
    fonts.forEach((font) => {
      html += `
          <div class="ar-font-card ${
            selectedFont === font.family ? "selected" : ""
          }" data-font="${font.family}">
            <div class="ar-font-name">${font.name}</div>
          </div>
        `;
    });

    grid.innerHTML = html;

    // Add click handlers
    grid.querySelectorAll(".ar-font-card").forEach((card) => {
      card.addEventListener("click", () => {
        grid
          .querySelectorAll(".ar-font-card")
          .forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
      });
    });
  }

  function setupFileUpload(uploadAreaId, fileInputId, isArabic) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(fileInputId);

    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const fontData = event.target.result;
        const fontName = file.name.replace(/\.(ttf|otf|woff|woff2)$/, "");

        saveCustomFont(fontName, fontData);
        loadCustomFont(fontName, fontData);

        showMessage(`Font "${fontName}" uploaded successfully!`, "success");

        // Add to grid
        const gridId = isArabic ? "ar-arabic-grid" : "ar-english-grid";
        const grid = document.getElementById(gridId);
        const previewText = isArabic
          ? "مرحبا بك في ريديت"
          : "Welcome to Reddit";

        const card = document.createElement("div");
        card.className = "ar-font-card";
        card.dataset.font = fontName;
        card.innerHTML = `
            <div class="ar-font-name">${fontName} (Custom)</div>
          `;

        card.addEventListener("click", () => {
          grid
            .querySelectorAll(".ar-font-card")
            .forEach((c) => c.classList.remove("selected"));
          card.classList.add("selected");
        });

        grid.insertBefore(card, grid.firstChild.nextSibling);
      };

      reader.readAsDataURL(file);
    });
  }

  function showMessage(text, type) {
    const messageDiv = document.getElementById("ar-message");
    if (!messageDiv) return;
    messageDiv.className = "ar-message " + type;
    messageDiv.textContent = text;
    setTimeout(() => messageDiv.classList.remove("success", "error"), 3000);
  }

  function processChatElements() {
    // البحث عن جميع Shadow Hosts
    const shadowHosts = document.querySelectorAll("*");

    shadowHosts.forEach((host) => {
      if (!host.shadowRoot) return;

      // رسائل الشات - جميع الأنماط الممكنة
      const messages = host.shadowRoot.querySelectorAll(
        ".room-message-text, .last-message, .room-message-body, [class*='message'], [class*='text']"
      );
      messages.forEach((el) => {
        applyRTLIfArabic(el);
      });

      // أسماء الغرف
      const roomNames = host.shadowRoot.querySelectorAll(
        ".room-name, [class*='room-name']"
      );
      roomNames.forEach((el) => {
        applyRTLIfArabic(el);
      });

      // جميع الفقرات والعناوين
      const textElements = host.shadowRoot.querySelectorAll(
        "p, h1, h2, h3, h4, h5, h6, span, div"
      );
      textElements.forEach((el) => {
        // تطبيق فقط على العناصر التي لها نص مباشر
        if (el.textContent && el.textContent.trim().length > 0) {
          applyRTLIfArabic(el);
        }
      });

      // حقل الإدخال
      const textareas = host.shadowRoot.querySelectorAll("textarea");
      textareas.forEach((el) => {
        // تطبيق عند التحميل
        if (hasArabic(el.value)) {
          el.style.direction = "rtl";
          el.style.textAlign = "right";
        }

        // مراقبة التغييرات
        if (!el.dataset.arabicListenerAdded) {
          el.dataset.arabicListenerAdded = "true";
          el.addEventListener("input", () => {
            if (hasArabic(el.value)) {
              el.style.direction = "rtl";
              el.style.textAlign = "right";
            } else {
              el.style.direction = "ltr";
              el.style.textAlign = "left";
            }
          });
        }
      });
    });

    // البحث عن جميع العناصر في DOM العادي أيضاً
    const allTextElements = document.querySelectorAll(
      ".room-message-body, .room-message-text, .last-message, .user-name, .room-name"
    );
    allTextElements.forEach((el) => {
      applyRTLIfArabic(el);
    });
  }

  async function initUI() {
    createUI();

    const savedArabicFont =
      getFromStorage(STORAGE_KEYS.ARABIC_FONT) || "default";
    const savedEnglishFont =
      getFromStorage(STORAGE_KEYS.ENGLISH_FONT) || "default";

    // Render font grids
    renderFontGrid(
      "ar-arabic-grid",
      ARABIC_FONTS,
      "مرحبا بك في ريديت",
      savedArabicFont
    );
    renderFontGrid(
      "ar-english-grid",
      ENGLISH_FONTS,
      "Welcome to Reddit",
      savedEnglishFont
    );

    // Setup file uploads
    setupFileUpload("ar-arabic-upload", "ar-arabic-file", true);
    setupFileUpload("ar-english-upload", "ar-english-file", false);

    // Load custom fonts
    const customFonts = getCustomFonts();
    customFonts.forEach((font) => {
      if (font.data) {
        loadCustomFont(font.name, font.data);
      }
    });

    // Apply saved fonts on load
    if (savedArabicFont !== "default") {
      const customFont = customFonts.find((f) => f.name === savedArabicFont);
      if (customFont) {
        applyFont(savedArabicFont, customFont.data);
      } else {
        applyFont(savedArabicFont);
      }
    }

    const saveBtn = document.getElementById("ar-save-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const arabicGrid = document.getElementById("ar-arabic-grid");
        const englishGrid = document.getElementById("ar-english-grid");

        const selectedArabic = arabicGrid.querySelector(
          ".ar-font-card.selected"
        );
        const selectedEnglish = englishGrid.querySelector(
          ".ar-font-card.selected"
        );

        const arabicFont = selectedArabic
          ? selectedArabic.dataset.font
          : "default";
        const englishFont = selectedEnglish
          ? selectedEnglish.dataset.font
          : "default";

        logger.info(
          "Saving fonts - Arabic: " + arabicFont + ", English: " + englishFont
        );

        saveToStorage(STORAGE_KEYS.ARABIC_FONT, arabicFont);
        saveToStorage(STORAGE_KEYS.ENGLISH_FONT, englishFont);

        showMessage("Settings saved! Reloading page...", "success");
        setTimeout(() => location.reload(), 1000);
      });
    }
  }

  function init() {
    logger.info("Starting...");
    fixDir();
    forceRTLDirection();
    processChatElements();
    const observer = new MutationObserver(() => {
      forceRTLDirection();
      processChatElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initUI);
    } else {
      initUI();
    }
  }

  init();
})();

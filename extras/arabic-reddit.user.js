// ==UserScript==
// @name           Reddit Better Font
// @version        1.1
// @description    Script that fixes arabic language in reddit
// @author         andronasef.dev
// @match          https://www.reddit.com/*
// @icon           https://www.google.com/s2/favicons?domain=reddit.com&sz=128
// ==/UserScript==

(function () {
  function logger(text) {
    console.log(`Arabic Reddit: ${text}`);
  }

  function addStyle(styleString) {
    const style = document.createElement("style");
    style.textContent = styleString;
    document.head.append(style);
  }

  function addFont(fontName) {
    // search if font is already added
    const fonts = document.querySelectorAll("style");
    for (const font of fonts) {
      if (font.textContent?.includes(fontName)) {
        return;
      }
    }

    logger(`addFont: ${fontName}`);
    addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=${fontName
              .split(" ")
              .join("+")}&display=swap');
              p {
                  overflow:hidden;
              }
              * {
                  font-family: ${fontName}, sans-serif !important;
              }
              `);
  }
  function fixDir() {
    logger(`fixing dir`);

    // fix direction in css
    addStyle(`
          p ,h1 {
            unicode-bidi: plaintext;
            text-align: start;
          }`);
  }

  function fixArabic() {
    addFont("Noto Sans Arabic");
    fixDir();
  }

  fixArabic();
})();

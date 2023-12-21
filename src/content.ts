function logger(text: string) {
  console.log(`Arabic Reddit: ${text}`);
}

function addStyle(styleString: string) {
  const style = document.createElement("style");
  style.textContent = styleString;
  document.head.append(style);
}

function addFont(fontName: string) {
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
  const allTags = document.querySelectorAll("p");
  allTags.forEach((e) => e.setAttribute("dir", "auto"));

  // check if it fucking work if development
  if (import.meta.env.DEV)
    addStyle(`
    :dir(rtl) {
        background-color:red
        }`);

  // Create an observer instance
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
      const allTags = document.querySelectorAll("p");
      allTags.forEach((e) => e.setAttribute("dir", "auto"));
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function fixArabic() {
  addFont("Noto Sans Arabic");
  fixDir();
}

// run on page load / changes
window.addEventListener("popstate", () => fixArabic());
// run on page load
document.addEventListener("DOMContentLoaded", () => fixArabic());
fixArabic();

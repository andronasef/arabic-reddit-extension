import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

const name = "Arabic Reddit";

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: env.mode === "staging" ? `[INTERNAL] ${name}` : name,
  version: `${major}.${minor}.${patch}.${label}`,
  version_name: version,
  icons: {
    "16": "public/icon16.png",
    "32": "public/icon32.png",
    "48": "public/icon48.png",
    "128": "public/icon128.png",
  },
  action: {
    default_popup: "index.html",
    default_icon: "public/icon.png",
  },
  content_scripts: [
    {
      matches: ["https://*.reddit.com/*"],
      js: ["src/content.ts"],
    },
  ],
}));

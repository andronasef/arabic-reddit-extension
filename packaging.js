import { zip } from "zip-a-folder";
import process from "process";

(async () => {
  await zip(`${process.cwd()}/dist`, "arabic-reddit.zip");
})();

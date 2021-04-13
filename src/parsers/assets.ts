import glob from "glob";
import { getAssetsDirName } from "../config";
import { copyLibFile } from "../utils/lib";

export const parseAssets = () => {
  const files = glob.sync(`**/${getAssetsDirName()}/`, {
    ignore: "**/node_modules/**",
    absolute: true,
  });

  files.forEach(copyLibFile);
};

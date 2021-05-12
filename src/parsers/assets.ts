import glob from "glob";
import { Config } from "../config";
import { copyLibFile } from "../lib";

export const parseAssets = () => {
  const outDir = Config.tsCompilerOptions
    ? `${Config.tsCompilerOptions.outDir}/**`
    : "";

  const files = glob.sync(`**/${Config.assetsDirName}/`, {
    ignore: ["**/node_modules/**", outDir],
    absolute: true,
  });

  files.forEach(copyLibFile);
};

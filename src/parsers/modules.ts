import glob from "glob";
import { Config } from "../config";
import { copyLibFile } from "../lib";

export const parseModules = () => {
  // Exclude the src dir with ts files when the outdir is set
  const rootDir =
    Config.tsCompilerOptions && Boolean(Config.tsCompilerOptions.outDir)
      ? `${Config.tsCompilerOptions.rootDir}/**`
      : "";

  const files = glob.sync(`**/${Config.modulesDirName}/`, {
    ignore: ["**/node_modules/**", rootDir],
    absolute: true,
  });

  files.forEach(copyLibFile);
};

import glob from "glob";
import { Config } from "../config";
import { copyLibFile } from "../lib";

export const parseModules = () => {
  const rootDir = Config.tsCompilerOptions
    ? `${Config.tsCompilerOptions.rootDir}/**`
    : "";

  const files = glob.sync(`**/${Config.modulesDirName}/`, {
    ignore: ["**/node_modules/**", rootDir],
    absolute: true,
  });

  files.forEach(copyLibFile);
};

import copy from "copy-dir";
import fs from "fs";
import { getOutDir } from "../config";

const removeSubPath = (absolutePath: string, subpath: string) => {
  if (!absolutePath.includes(subpath)) {
    return absolutePath;
  }

  return absolutePath.substring(
    absolutePath.indexOf(subpath) + subpath.length,
    absolutePath.length
  );
};

export const getOutPath = (absolutePath: string): string => {
  const pathNoRequireMain = removeSubPath(absolutePath, require.main.path);
  const pathNoCWD = removeSubPath(pathNoRequireMain, process.cwd());

  return getOutDir() + pathNoCWD;
};

export const setupOutPath = (absolutePath: string): string => {
  const outPath = getOutPath(absolutePath);

  clearAbsoluteOutPath(outPath);
  fixMissingPaths(outPath);

  return outPath;
};

export const clearAbsoluteOutPath = (absoluteOutPath: string) => {
  if (fs.existsSync(absoluteOutPath)) {
    fs.unlinkSync(absoluteOutPath);
  }
};

const fixMissingPaths = (absolutePath: string) => {
  let fullPath = "";

  absolutePath
    .split("/")
    .filter(Boolean)
    .forEach((path) => {
      fullPath = fullPath + "/" + path;

      if (!fs.existsSync(fullPath) && !path.includes(".")) {
        fs.mkdirSync(fullPath);
      }
    });
};

export const createLibFile = (absolutePath: string, content: string) => {
  const outPath = setupOutPath(absolutePath);

  fixMissingPaths(outPath);
  fs.writeFileSync(outPath, content);

  return outPath;
};

export const copyLibFile = (absolutePath: string) => {
  const outPath = setupOutPath(absolutePath);

  copy.sync(absolutePath, outPath);

  return outPath;
};

export const clearOutDir = () => {
  const outDir = getOutDir();
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir);
};

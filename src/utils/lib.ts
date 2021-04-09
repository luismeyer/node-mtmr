import copy from "copy-dir";
import fs from "fs";
import { getEntryDir, getOutDir } from "../config";

const removeEntryDir = (absolutePath: string) => {
  if (!fs.existsSync(absolutePath)) {
    throw new Error("File doesn't exist " + absolutePath);
  }

  const srcDir = getEntryDir();

  const srcDirIndex = absolutePath.indexOf(srcDir);
  if (srcDirIndex > -1) {
    return absolutePath.substring(
      srcDirIndex + srcDir.length,
      absolutePath.length
    );
  }

  return absolutePath;
};

const removeBasePath = (absolutePath: string) => {
  const base = process.cwd();

  const baseIndex = absolutePath.indexOf(base);
  if (baseIndex > -1) {
    return absolutePath.substring(baseIndex + base.length, absolutePath.length);
  }

  return absolutePath;
};

export const createOutPath = (absolutePath: string) => {
  const pathNoSrc = removeEntryDir(absolutePath);
  const pathNoBase = removeBasePath(pathNoSrc);

  return getOutDir() + pathNoBase;
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
  const outPath = createOutPath(absolutePath);

  clearAbsoluteOutPath(outPath);
  fixMissingPaths(outPath);

  fixMissingPaths(outPath);
  fs.writeFileSync(outPath, content);

  return outPath;
};

export const copyLibFile = (absolutePath: string) => {
  const outPath = createOutPath(absolutePath);

  clearAbsoluteOutPath(outPath);
  fixMissingPaths(outPath);

  copy.sync(absolutePath, outPath);

  return outPath;
};

export const clearOutDir = () => {
  const outDir = getOutDir();
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir);
};

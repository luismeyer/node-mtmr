import fs from "fs";
import { getOutDir, getSrcDir } from "../config";

const removeSrcDir = (absolutePath: string) => {
  if (!fs.existsSync(absolutePath)) {
    throw new Error("File doesn't exist " + absolutePath);
  }

  const srcDir = getSrcDir();

  const startIndex = absolutePath.indexOf(srcDir) + srcDir.length;
  return absolutePath.substring(startIndex, absolutePath.length);
};

export const srcToOutPath = (absolutePath: string) => {
  const pathInDist = removeSrcDir(absolutePath);

  return getOutDir() + pathInDist;
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
  const outPath = srcToOutPath(absolutePath);
  clearAbsoluteOutPath(outPath);

  fixMissingPaths(outPath);
  fs.writeFileSync(outPath, content);

  return outPath;
};

export const copyLibFile = (absolutePath: string) => {
  const outPath = srcToOutPath(absolutePath);
  clearAbsoluteOutPath(outPath);

  fixMissingPaths(outPath);

  fs.copyFileSync(absolutePath, outPath);

  return outPath;
};

export const clearLib = () => {
  const outDir = getOutDir();
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir);
};

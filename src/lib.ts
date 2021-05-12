import copy from "copy-dir";
import fs from "fs";
import { glob } from "glob";
import { resolve } from "path";
import { Config } from "./config";

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
  let path = absolutePath;

  if (require.main) {
    path = removeSubPath(path, require.main.path);
  }

  const { tsCompilerOptions } = Config;
  if (tsCompilerOptions) {
    path = removeSubPath(path, tsCompilerOptions.rootDir);

    path = tsCompilerOptions.outDir
      ? removeSubPath(path, tsCompilerOptions.outDir)
      : path;
  }

  return Config.absoluteOutDir + path;
};

export const setupOutPath = (absolutePath: string): string => {
  const outPath = getOutPath(absolutePath);

  clearAbsoluteOutPath(outPath);
  fixMissingPaths(outPath);

  return outPath;
};

export const clearAbsoluteOutPath = (absoluteOutPath: string) => {
  if (!fs.existsSync(absoluteOutPath)) {
    return;
  }

  fs.rmSync(absoluteOutPath, { recursive: true, force: true });
};

export const copyLibFile = (absolutePath: string) => {
  const outPath = setupOutPath(absolutePath);

  copy.sync(absolutePath, outPath);

  return outPath;
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

export type CompilerOptions = {
  outDir?: string;
  rootDir: string;
};

export const compilerOptions = (): CompilerOptions | undefined => {
  const configName = "tsconfig.json";

  const [tsconfigPath] = glob.sync(`**/${configName}`, {
    absolute: true,
    ignore: ["**/node_modules/**"],
  });

  if (!tsconfigPath) {
    return;
  }

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath).toString());
  const projectRoot = tsconfigPath.replace(configName, "");

  const { compilerOptions } = tsconfig;
  return {
    outDir: compilerOptions.outdir
      ? resolve(projectRoot, compilerOptions.outDir)
      : undefined,
    rootDir: resolve(projectRoot, compilerOptions.rootDir),
  };
};

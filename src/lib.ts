import copy from "copy-dir";
import fs from "fs";
import path from "path";
import { glob } from "glob";
import { join, dirname } from "path";
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
    path = tsCompilerOptions.rootDir
      ? removeSubPath(path, tsCompilerOptions.rootDir)
      : path;

    path = tsCompilerOptions.outDir
      ? removeSubPath(path, tsCompilerOptions.outDir)
      : path;
  }

  return join(Config.absoluteOutDir, path);
};

export const getInPath = (absolutePath: string): string => {
  const { tsCompilerOptions } = Config;

  if (!tsCompilerOptions?.outDir || !tsCompilerOptions?.rootDir) {
    return absolutePath;
  }

  return absolutePath.replace(
    tsCompilerOptions.outDir,
    tsCompilerOptions.rootDir
  );
};

export const setupOutPath = (absolutePath: string): string => {
  const outPath = getOutPath(absolutePath);
  const isFile = Boolean(path.extname(outPath));

  clearAbsoluteOutPath(outPath);
  fs.mkdirSync(dirname(outPath), { recursive: true });

  if (!isFile) {
    fs.mkdirSync(outPath);
  }

  return outPath;
};

export const clearAbsoluteOutPath = (absoluteOutPath: string): void => {
  if (!fs.existsSync(absoluteOutPath)) {
    return;
  }

  fs.rmSync(absoluteOutPath, { recursive: true, force: true });
};

export const copyLibFile = (absolutePath: string): string => {
  const outPath = setupOutPath(absolutePath);

  copy.sync(absolutePath, outPath);

  return outPath;
};

export type CompilerOptions = {
  outDir?: string;
  rootDir?: string;
};

export const compilerOptions = (): CompilerOptions | undefined => {
  const configName = "tsconfig.json";

  const [tsconfigPath] = glob.sync(configName, {
    absolute: true,
    ignore: ["**/node_modules/**"],
  });

  if (!tsconfigPath) {
    return;
  }

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath).toString());

  if (!tsconfig.compilerOptions) {
    return;
  }

  const projectRoot = tsconfigPath.replace(configName, "");
  const { rootDir, outDir } = tsconfig.compilerOptions;

  return {
    outDir: outDir && join(projectRoot, outDir),
    rootDir: rootDir && join(projectRoot, rootDir),
  };
};

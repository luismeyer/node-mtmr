import { compileApplescriptFile } from "../apple/compile-script";
import { MTMRSource } from "../typings/mtmr";
import { copyLibFile, getInPath, setupOutPath } from "../lib";
import { Source } from "../typings/api";
import { createJsWrapper } from "../apple/js-wrapper";

export const parseApplescriptSource = async (
  source: MTMRSource
): Promise<MTMRSource> => {
  if ("filePath" in source) {
    const inPath = getInPath(source.filePath);
    const outPath = setupOutPath(inPath) + ".scpt";

    return {
      filePath: await compileApplescriptFile(inPath, outPath),
    };
  }

  return source;
};

export const parseShellScriptSource = (source: Source): MTMRSource => {
  if ("filePath" in source) {
    const inPath = getInPath(source.filePath);
    return {
      filePath: copyLibFile(inPath),
    };
  }

  return source;
};

export const parseJavaScriptSource = async (
  jsSource: string,
  withSplit = false
): Promise<MTMRSource> => {
  const libPath = copyLibFile(jsSource);

  return {
    filePath: await createJsWrapper(libPath, withSplit),
  };
};

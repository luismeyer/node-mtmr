import { compileApplescriptFile } from "../apple/compile-script";
import { MTMRSource } from "../typings/mtmr";
import { setupOutPath } from "../utils/lib";

export const parseApplescriptSource = (source: MTMRSource) =>
  parseSource(source, (filePath: string) => {
    const outPath = setupOutPath(filePath) + ".scpt";
    return compileApplescriptFile(filePath, outPath);
  });

export const parseSource = async (
  source: MTMRSource,
  buildFunc: (filePath: string) => string | Promise<string>
): Promise<MTMRSource> => {
  if ("filePath" in source) {
    return {
      filePath: await buildFunc(source.filePath),
    };
  }

  return source;
};

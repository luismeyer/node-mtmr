import { MTMRSource } from "../typings/mtmr";
import { copyLibFile } from "../utils/lib";

export const parseSource = (source: MTMRSource): MTMRSource => {
  if ("filePath" in source) {
    return {
      filePath: copyLibFile(source.filePath),
    };
  }

  return source;
};

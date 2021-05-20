import { existsSync } from "fs";
import { MTMRAlternativeImages, MTMRImage } from "../typings/mtmr";
import { copyLibFile, getInPath } from "../lib";

export const parseImage = (image?: MTMRImage): MTMRImage | undefined => {
  if (!image) {
    return;
  }

  if ("filePath" in image) {
    const inPath = getInPath(image.filePath);
    const outPath = copyLibFile(inPath);

    if (!existsSync(outPath)) {
      throw new Error(
        `Error while parsing asset. Tried to find ${outPath} (based on ${image.filePath})`
      );
    }

    return {
      filePath: outPath,
    };
  }

  return image;
};

export const parseAlternativeImages = (
  images?: MTMRAlternativeImages
): MTMRAlternativeImages | undefined => {
  if (!images) {
    return;
  }

  const keys = Object.keys(images);

  if (keys.length === 0) {
    return;
  }

  const result: MTMRAlternativeImages = {};

  keys.forEach((key) => {
    const image = parseImage(images[key]);
    if (!image) {
      return;
    }

    result[key] = image;
  });

  return result;
};

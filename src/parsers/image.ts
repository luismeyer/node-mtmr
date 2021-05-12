import { existsSync } from "fs";
import { MTMRAlternativeImages, MTMRImage } from "../typings/mtmr";
import { getOutPath } from "../lib";

export const parseImage = (image?: MTMRImage): MTMRImage | undefined => {
  if (!image) {
    return;
  }

  if ("filePath" in image) {
    const outPath = getOutPath(image.filePath);

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
    const value = images[key];

    if ("filePath" in value) {
      const outPath = getOutPath(value.filePath);

      if (!existsSync(outPath)) {
        throw new Error("Missing asset " + images[key]);
      }

      result[key] = {
        filePath: outPath,
      };
    }
  });

  return result;
};

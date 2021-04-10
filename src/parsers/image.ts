import { existsSync } from "fs";
import { MTMRAlternativeImages, MTMRImage } from "../typings/mtmr";
import { getOutPath } from "../utils/lib";

export const parseImage = (image: MTMRImage): MTMRImage => {
  if (!image) {
    return;
  }

  if ("filePath" in image) {
    const outPath = getOutPath(image.filePath);

    if (!existsSync(outPath)) {
      throw new Error("Missing asset " + image);
    }

    return {
      filePath: outPath,
    };
  }

  return image;
};

export const parseAlternativeImages = (
  images: MTMRAlternativeImages
): MTMRAlternativeImages => {
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

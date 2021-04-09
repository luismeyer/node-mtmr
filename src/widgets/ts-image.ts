import { existsSync } from "fs";
import { MTMRAlternativeImages, MTMRImage } from "../mtmr–types";
import { createOutPath } from "../utils/lib";

export const parseTsImage = (imagePath: string): MTMRImage => {
  if (!imagePath) {
    return;
  }

  const outPath = createOutPath(imagePath);
  if (!existsSync(outPath)) {
    throw new Error("Missing asset " + imagePath);
  }

  return {
    filePath: outPath,
  };
};

export const parseTSImageObject = (images: {
  [key: string]: string;
}): MTMRAlternativeImages => {
  if (!images) {
    return;
  }

  const keys = Object.keys(images);

  if (keys.length === 0) {
    return;
  }

  const result: MTMRAlternativeImages = {};

  keys.forEach((key) => {
    const outPath = createOutPath(images[key]);

    if (!existsSync(outPath)) {
      throw new Error("Missing asset " + images[key]);
    }

    result[key] = {
      filePath: outPath,
    };
  });

  return result;
};

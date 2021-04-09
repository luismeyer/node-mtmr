import { resolve } from "path";
import { TsTitledButton } from "ts-mtmr";

export const CustomButton: TsTitledButton = {
  align: "left",
  type: "ts-titled-button",
  title: "00:00",
  bordered: true,
  refreshInterval: 1,
  source: resolve(__dirname, "./source.js"),
  image: {
    filePath: "./prime.png",
  },
  alternativeImages: {
    active: {
      filePath: "./prime-green.png",
    },
    inactive: {
      filePath: "./prime-red.png",
    },
  },
};

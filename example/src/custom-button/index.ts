import { resolve } from "path";
import { TsTitledButton } from "ts-mtmr";

export const CustomButton: TsTitledButton = {
  align: "left",
  type: "ts-titled-button",
  title: "00:00",
  bordered: true,
  background: "#454545",
  refreshInterval: 1,
  source: resolve(__dirname, "./source.js"),
  image: resolve(__dirname, "./assets/clock.png"),
  singleTap: resolve(__dirname, "./tap.js"),
  alternativeImages: {
    active: resolve(__dirname, "./assets/clock-green.png"),
    inactive: resolve(__dirname, "./assets/clock-red.png"),
  },
};

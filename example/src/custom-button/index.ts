import { ScriptTitledButton } from "node-mtmr";
import { resolve } from "path";

export const CustomButton: ScriptTitledButton = {
  align: "left",
  type: "scriptTitledButton",
  title: "00:00",
  bordered: true,
  background: "#454545",
  refreshInterval: 1,
  jsSource: resolve(__dirname, "./source.js"),
  image: {
    filePath: resolve(__dirname, "./assets/clock.png"),
  },
  actions: [
    {
      action: "javaScript",
      trigger: "singleTap",
      actionJavaScript: resolve(__dirname, "./tap.js"),
    },
  ],
  alternativeImages: {
    active: {
      filePath: resolve(__dirname, "./assets/clock-green.png"),
    },
    inactive: {
      filePath: resolve(__dirname, "./assets/clock-red.png"),
    },
  },
};

import { createItem, ScriptTitledButton } from "node-mtmr";

export const activeKey = "active";
export const inactiveKey = "inactive";

export const CustomButton: ScriptTitledButton = createItem({
  align: "left",
  type: "scriptTitledButton",
  title: "00:00",
  bordered: true,
  background: "#454545",
  refreshInterval: 1,
  sourceType: "javaScript",
  jsSource: {
    filePath: "./source.js",
  },
  image: {
    filePath: "./assets/clock.png",
  },
  actions: [
    {
      action: "javaScript",
      trigger: "singleTap",
      actionJavaScript: {
        filePath: "./tap.js",
      },
    },
  ],
  alternativeImages: {
    [activeKey]: {
      filePath: "./assets/clock-green.png",
    },
    [inactiveKey]: {
      filePath: "./assets/clock-red.png",
    },
  },
});

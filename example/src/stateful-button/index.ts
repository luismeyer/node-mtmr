import { ScriptTitledButton } from "node-mtmr";
import { resolve } from "path";

export const StatefulButton: ScriptTitledButton = {
  align: "left",
  type: "scriptTitledButton",
  title: "Count: 0",
  bordered: true,
  background: "#454545",
  refreshInterval: 1,
  sourceType: "javaScript",
  jsSource: resolve(__dirname, "./source.js"),
  actions: [
    {
      action: "javaScript",
      trigger: "singleTap",
      actionJavaScript: resolve(__dirname, "./tap.js"),
    },
  ],
};

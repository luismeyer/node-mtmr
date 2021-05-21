import { ScriptTitledButton, createItem, sourceOutput, state } from "node-mtmr";

const [counter, setCounter] = state("counter", 0);

export const StatefulButton: ScriptTitledButton = createItem({
  align: "left",
  type: "scriptTitledButton",
  title: "Count: 0",
  bordered: true,
  background: "#454545",
  refreshInterval: 1,
  sourceType: "javaScript",
  jsSource: {
    inline: () => {
      sourceOutput({
        label: `Count: ${counter}`,
      });
    },
  },
  actions: [
    {
      action: "javaScript",
      trigger: "singleTap",
      actionJavaScript: {
        inline: () => {
          setCounter(counter + 1);
        },
      },
    },
    {
      action: "javaScript",
      trigger: "longTap",
      actionJavaScript: {
        inline: () => {
          setCounter(0);
        },
      },
    },
  ],
});

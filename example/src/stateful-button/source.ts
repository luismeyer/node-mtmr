import { createSourceScriptSync, stateValue } from "node-mtmr";

createSourceScriptSync(() => {
  const count = stateValue<number>("counter", 0);

  return `Count: ${count}`;
});

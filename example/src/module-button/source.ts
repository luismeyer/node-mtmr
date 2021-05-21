import { createSourceScriptSync, stateValue } from "node-mtmr";
import { someModuleFunction, State } from "./module";

createSourceScriptSync(() => {
  const state = stateValue<State>("module-button", {
    title: "modules",
    toggle: true,
  });

  const title = someModuleFunction(state.title);

  return {
    label: title,
  };
});

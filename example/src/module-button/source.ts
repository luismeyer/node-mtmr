import { createSourceScriptSync, stateValue } from "node-mtmr";
import { someModuleFunction, State } from "./modules/module";

createSourceScriptSync(() => {
  const state = stateValue<State>("module-button", {
    title: "a module",
    toggle: true,
  });

  const title = someModuleFunction(state.title);

  return title;
});

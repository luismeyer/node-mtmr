import { createTsTitledScript } from "node-mtmr";
import { someModuleFunction } from "./modules/module";
import state from "./assets/state.json";

createTsTitledScript(() => {
  const title = someModuleFunction(state.title);

  return title;
});

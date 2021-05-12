import { createSourceScriptSync } from "node-mtmr";
import { someModuleFunction, useState } from "./modules/module";

createSourceScriptSync(() => {
  const [state] = useState();

  const title = someModuleFunction(state.title);

  return title;
});

import { createSourceScriptSync, stateValue } from "node-mtmr";

createSourceScriptSync(() => {
  const active = stateValue<boolean>("custom", false);
  const imageIdentifier = active ? "active" : "inactive";
  const buttonLabel = "Label";

  return [buttonLabel, imageIdentifier];
});

import { createSourceScriptSync, stateValue } from "node-mtmr";
import { activeKey, inactiveKey } from ".";

createSourceScriptSync(() => {
  const active = stateValue<boolean>("custom", false);
  const imageIdentifier = active ? activeKey : inactiveKey;
  const buttonLabel = "Label";

  return {
    label: buttonLabel,
    imgKey: imageIdentifier,
  };
});

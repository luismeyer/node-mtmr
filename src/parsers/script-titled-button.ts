import { createJsWrapper } from "../apple/js-wrapper";
import { ScriptTitledButton } from "../typings/api";
import { MTMRScriptTitledButton, MTMRSource } from "../typings/mtmr";
import { copyLibFile } from "../lib";
import { parseAlternativeImages } from "./image";
import {
  parseApplescriptSource,
  parseShellScriptSource,
  parseJavaScriptSource,
} from "./source";

const createType = (
  button: ScriptTitledButton
): MTMRScriptTitledButton["type"] => {
  if (
    button.sourceType === "appleScript" ||
    button.sourceType === "javaScript"
  ) {
    return "appleScriptTitledButton";
  }

  return "shellScriptTitledButton";
};

const createSource = async (
  button: ScriptTitledButton
): Promise<MTMRSource> => {
  if (button.sourceType === "appleScript") {
    return parseApplescriptSource(button.appleScriptSource);
  }

  if (button.sourceType === "shellScript") {
    return parseShellScriptSource(button.shellScriptSource);
  }

  if (button.sourceType === "javaScript") {
    return parseJavaScriptSource(
      button.jsSource,
      Object.keys(button.alternativeImages ?? {}).length > 0
    );
  }

  throw new Error("Missing Source");
};

export const parseScriptTitledButton = async (
  button: ScriptTitledButton
): Promise<MTMRScriptTitledButton> => ({
  type: createType(button),
  source: await createSource(button),
  alternativeImages: parseAlternativeImages(button.alternativeImages),
});

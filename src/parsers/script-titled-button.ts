import { createJsWrapper } from "../apple/js-wrapper";
import { ScriptTitledButton } from "../typings/api";
import { MTMRScriptTitledButton, MTMRSource } from "../typings/mtmr";
import { copyLibFile } from "../lib";
import { parseAlternativeImages } from "./image";
import { parseApplescriptSource, parseSource } from "./source";

type ButtonType = "appleScript" | "shellScript" | "javaScript";

const destructType = (button: ScriptTitledButton): ButtonType => {
  if ("appleScriptSource" in button) {
    return "appleScript";
  }

  if ("shellScriptSource" in button) {
    return "shellScript";
  }

  if ("jsSource" in button) {
    return "javaScript";
  }

  throw new Error("Missing source for button: " + button.type);
};

const createType = (type: ButtonType): MTMRScriptTitledButton["type"] => {
  if (type === "appleScript" || type === "javaScript") {
    return "appleScriptTitledButton";
  }

  return "shellScriptTitledButton";
};

const createSource = async (
  type: ButtonType,
  button: ScriptTitledButton
): Promise<MTMRSource> => {
  if (type === "appleScript" && button.appleScriptSource) {
    return parseApplescriptSource(button.appleScriptSource);
  }

  if (type === "shellScript" && button.shellScriptSource) {
    return parseSource(button.shellScriptSource, copyLibFile);
  }

  if (type === "javaScript" && button.jsSource) {
    const libPath = copyLibFile(button.jsSource);

    return {
      filePath: await createJsWrapper(
        libPath,
        Object.keys(button.alternativeImages ?? {}).length > 0
      ),
    };
  }

  throw new Error("Missing Source");
};

export const parseScriptTitledButton = async (
  button: ScriptTitledButton
): Promise<MTMRScriptTitledButton> => {
  const type = destructType(button);
  const source = await createSource(type, button);

  return {
    type: createType(type),
    source,
    alternativeImages: parseAlternativeImages(button.alternativeImages),
  };
};

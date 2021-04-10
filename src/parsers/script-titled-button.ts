import { createJsWrapper } from "../apple/js-wrapper";
import { ScriptTitledButton } from "../typings/api";
import { MTMRScriptTitledButton, MTMRSource } from "../typings/mtmr";
import { copyLibFile } from "../utils/lib";
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
  if (type === "appleScript") {
    return parseApplescriptSource(button.appleScriptSource);
  }

  if (type === "shellScript") {
    return parseSource(button.shellScriptSource, copyLibFile);
  }

  if (type === "javaScript") {
    const libPath = copyLibFile(button.jsSource);

    return {
      filePath: await createJsWrapper(
        libPath,
        Object.keys(button.alternativeImages ?? {}).length > 0
      ),
    };
  }
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

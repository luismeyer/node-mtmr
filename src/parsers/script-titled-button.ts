import { createJsWrapper } from "../apple/js-wrapper";
import { ScriptTitledButton } from "../typings/api";
import { MTMRScriptTitledButton, MTMRSource } from "../typings/mtmr";
import { copyLibFile } from "../utils/lib";
import { parseAlternativeImages } from "./image";
import { parseSource } from "./source";

type ButtonType = "appleScript" | "shellScript" | "typeScript";

const destructType = (button: ScriptTitledButton): ButtonType => {
  if ("appleScriptSource" in button) {
    return "appleScript";
  }

  if ("shellScriptSource" in button) {
    return "shellScript";
  }

  if ("tsSource" in button) {
    return "typeScript";
  }

  throw new Error("Missing source for button: " + button.type);
};

const createType = (type: ButtonType): MTMRScriptTitledButton["type"] => {
  if (type === "appleScript" || type === "typeScript") {
    return "appleScriptTitledButton";
  }

  return "shellScriptTitledButton";
};

const createSource = async (
  type: ButtonType,
  button: ScriptTitledButton
): Promise<MTMRSource> => {
  if (type === "appleScript") {
    return parseSource(button.appleScriptSource);
  }

  if (type === "shellScript") {
    return parseSource(button.shellScriptSource);
  }

  if (type === "typeScript") {
    const libPath = copyLibFile(button.tsSource);

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

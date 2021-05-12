import { createJsWrapper } from "../apple/js-wrapper";
import { Action } from "../typings/api";
import { MTMRAction } from "../typings/mtmr";
import { copyLibFile } from "../lib";
import { parseApplescriptSource } from "./source";

const parseAction = async (action: Action): Promise<MTMRAction> => {
  if (action.action === "appleScript") {
    return {
      ...action,
      actionAppleScript: await parseApplescriptSource(action.actionAppleScript),
    };
  }

  if (action.action === "shellScript") {
    return {
      ...action,
      executablePath: copyLibFile(action.executablePath),
    };
  }

  if (action.action === "javaScript") {
    const libPath = copyLibFile(action.actionJavaScript);

    return {
      ...action,
      action: "appleScript",
      actionAppleScript: {
        filePath: await createJsWrapper(libPath, false),
      },
    };
  }

  return action;
};

export const parseActions = (
  actions?: Action[]
): Promise<MTMRAction[]> | undefined => {
  if (!actions) {
    return;
  }

  return Promise.all(actions.map(parseAction));
};

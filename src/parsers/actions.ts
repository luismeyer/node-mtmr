import { Action } from "../typings/api";
import { MTMRAction } from "../typings/mtmr";
import { copyLibFile, getInPath } from "../lib";
import { parseApplescriptSource, parseJavaScriptSource } from "./source";

const parseAction = async (action: Action): Promise<MTMRAction> => {
  if (action.action === "appleScript") {
    return {
      ...action,
      actionAppleScript: await parseApplescriptSource(action.actionAppleScript),
    };
  }

  if (action.action === "shellScript") {
    const inPath = getInPath(action.executablePath);

    return {
      ...action,
      executablePath: copyLibFile(inPath),
    };
  }

  if (action.action === "javaScript") {
    return {
      ...action,
      action: "appleScript",
      actionAppleScript: await parseJavaScriptSource(action.actionJavaScript),
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

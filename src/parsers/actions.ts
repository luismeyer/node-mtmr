import { createJsWrapper } from "../apple/js-wrapper";
import { Action } from "../typings/api";
import { MTMRAction } from "../typings/mtmr";
import { copyLibFile } from "../utils/lib";
import { parseSource } from "./source";

const parseAction = async (action: Action): Promise<MTMRAction> => {
  if (action.action === "appleScript") {
    return {
      ...action,
      actionAppleScript: parseSource(action.actionAppleScript),
    };
  }

  if (action.action === "shellScript") {
    return {
      ...action,
      executablePath: copyLibFile(action.executablePath),
    };
  }

  if (action.action === "typeScript") {
    const libPath = copyLibFile(action.actionTypeScript);

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

export const parseActions = (actions: Action[]): Promise<MTMRAction[]> => {
  return Promise.all(actions.map(parseAction));
};

import { Action, BaseItem } from "../typings/api";
import { MTMRAction } from "../typings/mtmr";
import { copyLibFile, getInPath, makeAbsolute } from "../lib";
import { parseApplescriptSource, parseJavaScriptSource } from "./source";

const parseAction = async (
  action: Action,
  itemPath?: string
): Promise<MTMRAction> => {
  if (action.action === "appleScript") {
    return {
      ...action,
      actionAppleScript: await parseApplescriptSource(
        action.actionAppleScript,
        itemPath
      ),
    };
  }

  if (action.action === "shellScript") {
    const absolutePath = makeAbsolute(action.executablePath, itemPath);
    const inPath = getInPath(absolutePath);

    return {
      ...action,
      executablePath: copyLibFile(inPath),
    };
  }

  if (action.action === "javaScript") {
    return {
      ...action,
      action: "appleScript",
      actionAppleScript: await parseJavaScriptSource({
        source: action.actionJavaScript,
        buttonPath: itemPath,
      }),
    };
  }

  return action;
};

export const parseActions = (
  baseItem: BaseItem
): Promise<MTMRAction[]> | undefined => {
  if (!baseItem.actions) {
    return;
  }

  return Promise.all(
    baseItem.actions.map((action) => parseAction(action, baseItem.currentPath))
  );
};

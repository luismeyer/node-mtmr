import { TsTitledButton } from ".";
import { createJsWrapper } from "../../apple/js-wrapper";
import { MTMRAction } from "../../mtmr–types";
import { copyLibFile } from "../../utils/lib";

export const createScriptWithWrapper = (
  scriptPath: string,
  needsSplit?: boolean
) => {
  const libPath = copyLibFile(scriptPath);
  return createJsWrapper(libPath, needsSplit);
};

export const mergeActions = async (button: TsTitledButton) => {
  let actions: MTMRAction[] = [];

  const singleTapAction = button.actions?.find(
    ({ trigger }) => trigger === "singleTap"
  );

  if (button.singleTap || singleTapAction) {
    const wrappedSingleTap: MTMRAction = button.singleTap && {
      trigger: "singleTap",
      action: "appleScript",
      actionAppleScript: {
        filePath: await createScriptWithWrapper(button.singleTap),
      },
    };

    actions = [...actions, wrappedSingleTap ?? singleTapAction];
  }

  const longTapAction = button.actions?.find(
    ({ trigger }) => trigger === "longTap"
  );

  if (button.longTap || longTapAction) {
    const wrappedLongTap: MTMRAction = button.longTap && {
      trigger: "longTap",
      action: "appleScript",
      actionAppleScript: {
        filePath: await createScriptWithWrapper(button.longTap),
      },
    };

    actions = [...actions, wrappedLongTap ?? longTapAction];
  }

  return actions;
};

import { MTMRSource } from "./assets";

export type MTMRActionTrigger =
  | "singleTap"
  | "doubleTap"
  | "tripleTap"
  | "longTap";

export type MTMRActionType =
  | "hidKey"
  | "keyPress"
  | "appleScript"
  | "shellScript"
  | "openUrl";

export type MTMRHidKeyAction = {
  trigger: MTMRActionTrigger;
  action: "hidKey";
  keycode: number;
};

export type MTMRKeyPressAction = {
  trigger: MTMRActionTrigger;
  action: "keyPress";
  keycode: number;
};

export type MTMRAppleScriptAction = {
  trigger: MTMRActionTrigger;
  action: "appleScript";
  actionAppleScript: MTMRSource;
};

export type MTMRShellScriptAction = {
  trigger: MTMRActionTrigger;
  action: "shellScript";
  executablePath: string;
  shellArguments?: string[];
};

export type MTMROpenUrlAction = {
  trigger: MTMRActionTrigger;
  action: "openUrl";
  url: string;
};

export type MTMRAction =
  | MTMRHidKeyAction
  | MTMRKeyPressAction
  | MTMRAppleScriptAction
  | MTMRShellScriptAction
  | MTMROpenUrlAction;

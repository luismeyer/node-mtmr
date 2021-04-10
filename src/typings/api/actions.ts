import { Source } from "./assets";

export type ActionTrigger = "singleTap" | "doubleTap" | "tripleTap" | "longTap";

export type HidKeyAction = {
  trigger: ActionTrigger;
  action: "hidKey";
  keycode: number;
};

export type KeyPressAction = {
  trigger: ActionTrigger;
  action: "keyPress";
  keycode: number;
};

export type AppleScriptAction = {
  trigger: ActionTrigger;
  action: "appleScript";
  actionAppleScript: Source;
};

export type ShellScriptAction = {
  trigger: ActionTrigger;
  action: "shellScript";
  executablePath: string;
  shellArguments?: string[];
};

export type OpenUrlAction = {
  trigger: ActionTrigger;
  action: "openUrl";
  url: string;
};

export type JavaScriptAction = {
  trigger: ActionTrigger;
  action: "javaScript";
  actionJavaScript: string;
};

export type Action =
  | HidKeyAction
  | KeyPressAction
  | AppleScriptAction
  | ShellScriptAction
  | OpenUrlAction
  | JavaScriptAction;

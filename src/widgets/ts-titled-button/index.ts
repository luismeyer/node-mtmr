import {
  MTMRAction,
  MTMRAlternativeImages,
  MTMRImage,
  MTMRScriptTitledButton,
} from "../../mtmr–types";
import { createScriptWithWrapper, mergeActions } from "./api";

export type TsTitledButton = {
  type: "ts-titled-button";
  title?: string;
  source: string;
  singleTap?: string;
  longTap?: string;
  align?: "left" | "center" | "right";
  width?: number;
  background?: string;
  bordered?: boolean;
  image?: MTMRImage;
  refreshInterval?: number;
  alternativeImages?: MTMRAlternativeImages;
  autoResize?: boolean;
  actions?: MTMRAction[];
};

export const parseTsTitledButton = async (
  button: TsTitledButton
): Promise<MTMRScriptTitledButton> => {
  return {
    ...button,
    type: "appleScriptTitledButton",
    title: button.title,
    source: {
      filePath: await createScriptWithWrapper(
        button.source,
        Object.keys(button.alternativeImages).length > 0
      ),
    },
    actions: await mergeActions(button),
  };
};

export const createTsTitledScript = (func: () => string | [string, string]) => {
  const result = func();

  if (Array.isArray(result)) {
    console.log(`${result[0]}, ${result[1]}`);
  } else {
    console.log(result);
  }
};

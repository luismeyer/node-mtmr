import { MTMRAction, MTMRScriptTitledButton } from "../../mtmr–types";
import { parseTsImage, parseTSImageObject } from "../ts-image";
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
  image?: string;
  refreshInterval?: number;
  alternativeImages?: {
    [key: string]: string;
  };
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
        Object.keys(button.alternativeImages ?? {}).length > 0
      ),
    },
    image: parseTsImage(button.image),
    alternativeImages: parseTSImageObject(button.alternativeImages),
    actions: await mergeActions(button),
  };
};

type TsTitledScriptResult = string | [string, string];

export const createTsTitledScript = (func: () => TsTitledScriptResult) => {
  const result = func();

  if (Array.isArray(result)) {
    console.log(`${result[0]},${result[1]}`);
  } else {
    console.log(result);
  }
};

export const createAsyncTsTitledScript = (
  func: () => Promise<TsTitledScriptResult>
) => {
  func().then((result) => {
    if (Array.isArray(result)) {
      console.log(`${result[0]},${result[1]}`);
    } else {
      console.log(result);
    }
  });
};

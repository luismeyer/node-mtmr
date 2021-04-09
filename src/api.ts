import { getOutDir, getSrcDir, setOutDir, setSrcDir } from "./config";
import {
  MTMRBattery,
  MTMRBrightness,
  MTMRBrightnessDown,
  MTMRBrightnessUp,
  MTMRClose,
  MTMRCurrency,
  MTMRDarkMode,
  MTMRDisplaySleep,
  MTMRDnd,
  MTMRDock,
  MTMREscape,
  MTMRExitTouchbar,
  MTMRGesture,
  MTMRGroup,
  MTMRIlluminationDown,
  MTMRIlluminationUp,
  MTMRInputsource,
  MTMRItem,
  MTMRMusic,
  MTMRMute,
  MTMRNetwork,
  MTMRNext,
  MTMRNightShift,
  MTMRPlay,
  MTMRPomodoro,
  MTMRPrevious,
  MTMRSleep,
  MTMRStaticButton,
  MTMRTimeButton,
  MTMRUpnext,
  MTMRVolumeDown,
  MTMRVolumeUp,
  MTMRVolumne,
  MTMRWeather,
} from "./mtmr–types";
import { clearLib } from "./utils/lib";
import {
  parseTsTitledButton,
  TsTitledButton,
} from "./widgets/ts-titled-button";

export type Item =
  | TsTitledButton
  | MTMRGesture
  | MTMRBrightness
  | MTMRVolumne
  | MTMRStaticButton
  | MTMRGroup
  | MTMRClose
  | MTMRMusic
  | MTMRPomodoro
  | MTMRNetwork
  | MTMRDock
  | MTMREscape
  | MTMRBrightnessDown
  | MTMRBrightnessUp
  | MTMRExitTouchbar
  | MTMRIlluminationUp
  | MTMRIlluminationDown
  | MTMRVolumeDown
  | MTMRVolumeUp
  | MTMRMute
  | MTMRTimeButton
  | MTMRBattery
  | MTMRCurrency
  | MTMRWeather
  | MTMRInputsource
  | MTMRNightShift
  | MTMRDnd
  | MTMRDarkMode
  | MTMRUpnext
  | MTMRPrevious
  | MTMRPlay
  | MTMRNext
  | MTMRSleep
  | MTMRDisplaySleep;

type InitParams = {
  srcDir: string;
  outDir: string;
};

export const init = ({ srcDir, outDir }: InitParams) => {
  setOutDir(outDir);
  setSrcDir(srcDir);
};

const handleItem = (item: Item): Promise<MTMRItem> => {
  switch (item.type) {
    case "ts-titled-button":
      return parseTsTitledButton(item);
    default:
      return Promise.resolve(item);
  }
};

export const parseItems = async (items: Item[]) => {
  if (!getOutDir()) {
    throw new Error("Missing absolute outDir");
  }

  if (!getSrcDir()) {
    throw new Error("Missing absolute srcDir");
  }

  clearLib();

  return await Promise.all(items.map(handleItem));
};

import { existsSync, writeFileSync } from "fs";
import glob from "glob";
import {
  getAssetsDirName,
  getEntryDir,
  getOutDir,
  setAssetsDirName,
  setEntryDir,
  setOutDir,
} from "./config";
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
import { clearOutDir, copyLibFile } from "./utils/lib";
import {
  parseTsTitledButton,
  TsTitledButton,
} from "./widgets/ts-titled-button";

const { HOME } = process.env;

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
  absoluteEntryDir: string;
  absoluteOutDir: string;
  assetsDirName: string;
};

const copyAssets = () => {
  const files = glob.sync(`**/${getAssetsDirName()}/`, {
    ignore: "**/node_modules/**",
    absolute: true,
  });

  files.forEach(copyLibFile);
};

const handleItem = (item: Item): Promise<MTMRItem> => {
  switch (item.type) {
    case "ts-titled-button":
      return parseTsTitledButton(item);
    default:
      return Promise.resolve(item);
  }
};

const parseItems = async (items: Item[]) => {
  if (!getOutDir()) {
    throw new Error("Missing absolute outDir");
  }

  if (!getEntryDir()) {
    throw new Error("Missing absolute srcDir");
  }

  if (!getAssetsDirName()) {
    throw new Error("Missing absolute srcDir");
  }

  clearOutDir();

  copyAssets();

  const result = await Promise.all(items.map(handleItem));

  console.info("Successfully parsed items...");

  return result;
};

export const createParse = ({
  absoluteEntryDir,
  absoluteOutDir,
  assetsDirName,
}: InitParams) => {
  setOutDir(absoluteOutDir);
  setEntryDir(absoluteEntryDir);
  setAssetsDirName(assetsDirName);

  console.info("Initiated ts-mtmr...");

  return parseItems;
};

type SaveItemsOptions = {
  force?: boolean;
};

export const saveItems = (items: MTMRItem[], options?: SaveItemsOptions) => {
  const configPath = HOME + "/Library/Application Support/MTMR/items.json";

  const configAlreadyExists = existsSync(configPath);

  if (configAlreadyExists && !options?.force) {
    throw new Error(
      "items.json already exists. Use the 'force' param to overwrite"
    );
  }

  writeFileSync(configPath, JSON.stringify(items));

  console.info("Created items.json...");
};

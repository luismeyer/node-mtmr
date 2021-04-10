import { existsSync, writeFileSync } from "fs";
import glob from "glob";
import {
  Configuration,
  getAssetsDirName,
  getEntryDir,
  getOutDir,
  initConfig,
} from "./config";
import { parse } from "./parsers";
import { Item } from "./typings/api";
import { MTMRItem } from "./typings/mtmr";
import { clearOutDir, copyLibFile } from "./utils/lib";
import { loggerInfo } from "./utils/logging";

const { HOME } = process.env;

const copyAssets = () => {
  const files = glob.sync(`**/${getAssetsDirName()}/`, {
    ignore: "**/node_modules/**",
    absolute: true,
  });

  files.forEach(copyLibFile);
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

  const result = await Promise.all(items.map(parse));

  loggerInfo("Successfully parsed items...");

  return result;
};

export const createParse = (config: Configuration) => {
  initConfig(config);

  loggerInfo("Initiated ts-mtmr...");

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

  loggerInfo("Created items.json...");
};

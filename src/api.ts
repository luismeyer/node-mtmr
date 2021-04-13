import { existsSync, writeFileSync } from "fs";
import { Configuration, initConfig } from "./config";
import { parse } from "./parsers";
import { parseAssets } from "./parsers/assets";
import { Item } from "./typings/api";
import { MTMRItem } from "./typings/mtmr";
import { clearOutDir } from "./utils/lib";
import { loggerError, loggerInfo } from "./utils/logging";

const { HOME } = process.env;

const parseItems = async (items: Item[]) => {
  clearOutDir();
  loggerInfo("Cleared outDir...");

  parseAssets();
  loggerInfo("Parsed assets...");

  const result = await Promise.all(items.map(parse));
  loggerInfo("Parsed items...");

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
    loggerError(
      "items.json already exists. Use the 'force' param to overwrite"
    );
  }

  writeFileSync(configPath, JSON.stringify(items));
  loggerInfo("Created items.json...");
};

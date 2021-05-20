import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { Config, ConfigurationOptions, initConfig } from "./config";
import { parse } from "./parsers";
import { Item } from "./typings/api";
import { MTMRItem } from "./typings/mtmr";
import { loggerError, loggerInfo } from "./logging";

const { HOME } = process.env;

type Parse = (items: Item[]) => Promise<MTMRItem[]>;

const parseItems: Parse = async (items) => {
  const outDir = Config.absoluteOutDir;
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir);

  loggerInfo("Cleared outDir...");

  const result = await Promise.all(items.map(parse));
  loggerInfo("Parsed items...");

  return result;
};

type CreateParse = (config: ConfigurationOptions) => Parse;

export const createParse: CreateParse = (config) => {
  initConfig(config);
  loggerInfo("Initiated node-mtmr...");

  return parseItems;
};

type SaveItemsOptions = {
  force?: boolean;
};

export const saveItems = (
  items: MTMRItem[],
  options?: SaveItemsOptions
): void => {
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

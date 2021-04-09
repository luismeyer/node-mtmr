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
import { parse } from "./parsers";
import { Item } from "./typings/api";
import { MTMRItem } from "./typings/mtmr";
import { clearOutDir, copyLibFile } from "./utils/lib";

const { HOME } = process.env;

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

import path from "path";
import { init, Item, parseItems, saveItems } from "ts-mtmr";
import { ControllsGroup } from "./controlls-group";
import { CustomButton } from "./custom-button";

const items: Item[] = [
  CustomButton,
  { type: "dock", align: "left", width: 200 },
  ControllsGroup,
];

const execute = async () => {
  init({
    absoluteEntryDir: path.resolve(__dirname, "./"),
    absoluteOutDir: path.resolve(__dirname, "../mtmr"),
    assetsDirName: "assets",
  });

  const result = await parseItems(items);

  saveItems(result, { force: true });
};

execute();

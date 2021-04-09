import path from "path";
import { createParse, Item, saveItems } from "ts-mtmr";
import { ControllsGroup } from "./controlls-group";
import { CustomButton } from "./custom-button";

const items: Item[] = [
  CustomButton,
  { type: "dock", align: "left", width: 200 },
  ControllsGroup,
];

const execute = async () => {
  const parse = createParse({
    absoluteEntryDir: path.resolve(__dirname, "./"),
    absoluteOutDir: path.resolve(__dirname, "../mtmr"),
    assetsDirName: "assets",
  });

  const result = await parse(items);

  saveItems(result, { force: true });
};

execute();

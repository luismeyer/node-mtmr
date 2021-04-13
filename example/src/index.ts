import { createParse, Item, saveItems } from "node-mtmr";
import path from "path";
import { ControllsGroup } from "./controlls-group";
import { CustomButton } from "./custom-button";

const items: Item[] = [
  CustomButton,
  { type: "dock", align: "left", width: 200 },
  ControllsGroup,
];

const execute = async () => {
  const parse = createParse({
    absoluteOutDir: path.resolve(__dirname, "../mtmr-dist"),
    assetsDirName: "assets",
    loggingEnabled: true,
  });

  const result = await parse(items);

  saveItems(result, { force: true });
};

execute();

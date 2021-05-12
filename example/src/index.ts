import { createParse, Item, saveItems } from "node-mtmr";
import path from "path";
import { ControllsGroup } from "./controlls-group";
import { CustomButton } from "./custom-button";
import { ModuleButton } from "./module-button";

const items: Item[] = [
  CustomButton,
  ModuleButton,
  { type: "dock", align: "left", width: 200 },
  ControllsGroup,
];

const execute = async () => {
  const parse = createParse({
    absoluteOutDir: path.resolve(__dirname, "../mtmr-dist"),
    assetsDirName: "assets",
    modulesDirName: "modules",
    loggingEnabled: true,
  });

  const result = await parse(items);

  saveItems(result, { force: true });
};

execute();

import { createParse, Item, saveItems } from "node-mtmr";
import path from "path";
import { ControllsGroup } from "./controlls-group";
import { CustomButton } from "./custom-button";
import { ModuleButton } from "./module-button";
import { StatefulButton } from "./stateful-button";

const items: Item[] = [
  CustomButton,
  ModuleButton,
  StatefulButton,
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

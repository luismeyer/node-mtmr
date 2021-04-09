import { writeFileSync } from "fs";
import path from "path";
import { init, Item, parseItems } from "ts-mtmr";
import { CustomButton } from "./custom-button";

const items: Item[] = [
  CustomButton,
  { type: "dock", align: "left", width: 200 },
];

const parse = async () => {
  init({
    srcDir: path.resolve(__dirname, "./"),
    outDir: path.resolve(__dirname, "../mtmr"),
  });

  const result = await parseItems(items);

  writeFileSync("./items.json", JSON.stringify(result));
};

parse();

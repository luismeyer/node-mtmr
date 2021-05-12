import fs from "fs";
import path from "path";
import state from "./assets/state.json";
import { anotherModuleFunction } from "./modules/module";

state.title = anotherModuleFunction(state.toggle ? "not a module" : "a module");
state.toggle = !state.toggle;

fs.writeFileSync(
  path.resolve(__dirname, "./assets/state.json"),
  JSON.stringify(state)
);

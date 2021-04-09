import fs from "fs";
import path from "path";
import state from "./assets/state.json";

const newState = {
  ...state,
  active: !state.active,
};

fs.writeFileSync(
  path.resolve(__dirname, "./assets/state.json"),
  JSON.stringify(newState)
);

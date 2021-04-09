import { createTsTitledScript } from "ts-mtmr";
import state from "./assets/state.json";

createTsTitledScript(() => {
  const res = state.active ? "active" : "inactive";

  return [res, res];
});

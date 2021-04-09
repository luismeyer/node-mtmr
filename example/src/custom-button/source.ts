import { createTsTitledScript } from "ts-mtmr";

createTsTitledScript(() => {
  const a = "test";
  const b = "active";

  return [a, b];
});

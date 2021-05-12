import { state } from "node-mtmr";

export function someModuleFunction(arg: string) {
  return "this " + arg;
}

export function anotherModuleFunction(arg: string) {
  return "is " + arg;
}

export const useState = () =>
  state("module-button", {
    title: "a module",
    toggle: true,
  });

export function someModuleFunction(arg: string): string {
  return "this " + arg;
}

export function anotherModuleFunction(arg: string): string {
  return "is " + arg;
}

export type State = {
  title: string;
  toggle: boolean;
};

import { anotherModuleFunction, useState } from "./modules/module";

const [state, setState] = useState();

setState({
  title: anotherModuleFunction(state.toggle ? "not a module" : "a module"),
  toggle: !state.toggle,
});

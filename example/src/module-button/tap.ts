import { anotherModuleFunction, State } from "./module";
import { state as useState } from "node-mtmr";

const [state, setState] = useState<State>("module-button");

setState({
  title: anotherModuleFunction(state.toggle ? "elefants" : "modules"),
  toggle: !state.toggle,
});

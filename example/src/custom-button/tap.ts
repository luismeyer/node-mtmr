import { state } from "node-mtmr";

const [active, setActive] = state<boolean>("custom", false);

setActive(!active);

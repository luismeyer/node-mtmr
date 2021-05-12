import { state } from "node-mtmr";

const [count, setCount] = state<number>("counter");

setCount(count + 1);

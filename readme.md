# Node MTMR

This is a Node library which wraps around [MTMR](https://github.com/Toxblh/MTMR). It is highly recommended to use this library with typescript. The main features are:

1. TS/JS support for button handlers
2. Typescript typings for the items.json

For further documentation have a look at the original [repo](https://github.com/Toxblh/MTMR).

## Installation

```bash
npm i node-mtmr
```

Or

```bash
yarn add node-mtmr
```

## Setup

A working example can be found [here](./example).

IMPORTANT: Make sure you have no "outDir" configured in your tsconfig. Otherwise the path"s are messed up!!!

### Initialize parse

Create an index file inside your "src" directory. In this file call the "createParse" function:

```js
import { createParse } from "node-mtmr";

const parse = createParse({
  absoluteOutDir: "/Users/username/my-mtmr-config",
  assetsDirName: "assets",
  loggingEnabled: true,
});
```

1. "absoluteOutDir" is the output path for the script and assets
2. "assetsDirName" is the name of all asset directories. On parse the lib will copy all asset directories into the "absoluteOutDir"
3. "loggingEnabled" configures the logging output

### Execute parse

Pass the items to the parse function. The result is a correct MTMR item array.

```js
const result = await parse(items);
```

### Save result

There is a utility function for saving the output into the MTMR directory. Pass an options object with the force set to true to overwrite an existing file.

```js
import { saveItems } from "node-mtmr";

saveItems(result, { force: true });
```

## Hints

Instead of looking up the absolute path of your folder you can just use the node's path lib

```js
absoluteOutDir: path.resolve(__dirname, "../mtmr");
```

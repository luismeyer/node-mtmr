# Node MTMR

This is a Node library which wraps around [MTMR](https://github.com/Toxblh/MTMR). It is highly recommended to use this library with typescript. The main features are:

1. TS/JS support for button handlers
2. Typescript typings for the items.json

For further documentation have a look at the original [repo](https://github.com/Toxblh/MTMR)

## Installation

```bash
npm i node-mtmr
```

Or

```bash
yarn add node-mtmr
```

## Setup

A working example can be found [here](./example)

IMPORTANT: Make sure you have no "outDir" configured in your tsconfig. Otherwise the path's are weird

In your index file create the parse function

```js
import { createParse } from "ts-mtmr";

const parse = createParse({
  absoluteEntryDir: path.resolve(__dirname, "./"),
  absoluteOutDir: path.resolve(__dirname, "../mtmr"),
  assetsDirName: "assets",
});
```

1. 'absoluteEntryDir' tells the library where the index file is located
2. 'absoluteOutDir' is the output path for the script and assets
3. 'assetsDirName' configures the name of the asset directories. On parse the lib will copy all asset directories into the 'absoluteOutDir'

Pass the items to the parse function. The result is a correct MTMR item array.

```js
const result = await parse(items);
```

There is a utility function for saving the output into the MTMR directory. Pass an options object with the force set to true to overwrite an existing file.

```js
import { saveItems } from "ts-mtmr";

saveItems(result, { force: true });
```

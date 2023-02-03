import generate from "@babel/generator";
import { parse } from "@babel/parser";
import { readFileSync, writeFileSync } from "fs";
import { basename, dirname, join } from "path";
import { compileApplescriptFile, createJsWrapper } from "../apple";
import {
  callUnnamedLambda,
  findAllImportPaths,
  missingStatements,
  prependNodes,
} from "../ast";
import { copyLibFile, getInPath, makeAbsolute, setupOutPath } from "../lib";
import { JsSource, Source } from "../typings/api";
import { MTMRSource } from "../typings/mtmr";
import { randomName } from "../utils";

export const parseApplescriptSource = async (
  source: Source,
  buttonPath?: string
): Promise<MTMRSource> => {
  if ("filePath" in source) {
    const absolutePath = makeAbsolute(source.filePath, buttonPath);

    const inPath = getInPath(absolutePath);
    const outPath = setupOutPath(inPath) + ".scpt";

    return {
      filePath: await compileApplescriptFile(inPath, outPath),
    };
  }

  return source;
};

export const parseShellScriptSource = (
  source: Source,
  buttonPath?: string
): MTMRSource => {
  if ("filePath" in source) {
    const absolutePath = makeAbsolute(source.filePath, buttonPath);
    const inPath = getInPath(absolutePath);
    return {
      filePath: copyLibFile(inPath),
    };
  }

  return source;
};

type ParseTypeScriptSourceOption = {
  source: JsSource;
  buttonPath?: string;
  withSplit?: boolean;
};

export const parseJavaScriptSource = async ({
  source,
  withSplit = false,
  buttonPath,
}: ParseTypeScriptSourceOption): Promise<MTMRSource> => {
  if ("filePath" in source) {
    const absolutePath = makeAbsolute(source.filePath, buttonPath);

    // recursive search all import files that have to moved to th outDir
    const imports = findAllImportPaths(absolutePath);
    imports.forEach((im) => copyLibFile(im));

    const libPath = copyLibFile(absolutePath);

    return {
      filePath: await createJsWrapper(libPath, withSplit),
    };
  }

  if ("inline" in source) {
    // buttonPath is needed to find the dependencies outside of the function scope
    if (!buttonPath) {
      throw new Error(
        "Missing path of the button definition. For TS Buttons the 'currentPath' arg is mandatory. Please use the util function 'createItem' to avoid this error"
      );
    }

    const fc = source.inline.toString();
    const fileSourceWithoutFc = readFileSync(buttonPath)
      .toString()
      .replace(fc, "null");

    // search for all dependencies, variables and functions outside function scope
    // that are needed inside the function
    const outNodes = missingStatements(fc, fileSourceWithoutFc);

    const node = parse(fc);
    prependNodes(node, outNodes);
    callUnnamedLambda(node);

    // setup output file
    const dir = dirname(buttonPath);
    const fileName = `${randomName()}.${basename(buttonPath)}`;
    const libPath = setupOutPath(join(dir, fileName));

    const output = generate(node).code;
    writeFileSync(libPath, output);

    // copy missing required modules
    const imports = findAllImportPaths(buttonPath);
    imports.forEach((im) => copyLibFile(im));

    return {
      filePath: await createJsWrapper(libPath, withSplit),
    };
  }

  return {
    filePath: "NONE",
  };
};

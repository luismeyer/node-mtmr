import generate from "@babel/generator";
import { parse } from "@babel/parser";
import { readFileSync, writeFileSync } from "fs";
import { basename, dirname, join } from "path";
import { compileApplescriptFile } from "../apple/compile-script";
import { createJsWrapper } from "../apple/js-wrapper";
import {
  callUnnamedLambda,
  findAllImportPaths,
  missingStatements,
  prependNodes,
} from "../ast";
import { copyLibFile, getInPath, setupOutPath } from "../lib";
import { JsSource, Source } from "../typings/api";
import { MTMRSource } from "../typings/mtmr";
import { randomName } from "../utils";

export const parseApplescriptSource = async (
  source: Source
): Promise<MTMRSource> => {
  if ("filePath" in source) {
    const inPath = getInPath(source.filePath);
    const outPath = setupOutPath(inPath) + ".scpt";

    return {
      filePath: await compileApplescriptFile(inPath, outPath),
    };
  }

  return source;
};

export const parseShellScriptSource = (source: Source): MTMRSource => {
  if ("filePath" in source) {
    const inPath = getInPath(source.filePath);
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
    const libPath = copyLibFile(source.filePath);

    const imports = findAllImportPaths(source.filePath);
    imports.forEach(copyLibFile);

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
    const outNodes = missingStatements([], fc, fileSourceWithoutFc);

    const node = parse(fc);
    prependNodes(node, outNodes);
    callUnnamedLambda(node);

    // setup output file
    const dir = dirname(buttonPath);
    const fileName = `${randomName()}.${basename(buttonPath)}`;
    const libPath = setupOutPath(join(dir, fileName));

    const output = generate(node).code;

    writeFileSync(libPath, output);

    return {
      filePath: await createJsWrapper(libPath, withSplit),
    };
  }

  return {
    filePath: "NONE",
  };
};

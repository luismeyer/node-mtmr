import { exec } from "child_process";
import { writeFileSync } from "fs";
import { randomName } from "../utils";

const tempFilePath = (fileExtension: string): string =>
  `/tmp/${randomName()}.${fileExtension}`;

const createTempScript = (script: string): string => {
  const tmpPath = tempFilePath("applescript");

  writeFileSync(tmpPath, script);

  return tmpPath;
};

export const compileApplescriptFile = (
  scriptPath: string,
  outputPath?: string
): Promise<string> => {
  const out = outputPath ?? tempFilePath("scpt");

  return new Promise((resolve, reject) => {
    exec(`osacompile -o ${out} ${scriptPath}`, (err) => {
      if (err) {
        reject(err);
      }

      resolve(out);
    });
  });
};

export const compileApplescriptString = (
  script: string,
  outputFile?: string
): Promise<string> => {
  const filePath = createTempScript(script);
  return compileApplescriptFile(filePath, outputFile);
};

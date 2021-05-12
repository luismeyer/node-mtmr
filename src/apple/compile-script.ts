import { exec } from "child_process";
import { writeFileSync } from "fs";

const tempFilePath = (fileExtension: string): string => {
  const filename = new Date().toISOString().replace(/[-:.]/g, "");
  const randomNumber = Math.floor(Math.random() * (10000 + 1));

  return `/tmp/${filename + randomNumber}.${fileExtension}`;
};

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

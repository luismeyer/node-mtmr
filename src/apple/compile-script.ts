import { exec } from "child_process";
import { writeFileSync } from "fs";

const createTmpFileName = (fileExtension: string): string => {
  const filename = new Date().toISOString().replace(/[-:.]/g, "");
  const randomNumber = Math.floor(Math.random() * (10000 + 1));

  return `/tmp/${filename + randomNumber}.${fileExtension}`;
};

const createTempScript = (script: string): string => {
  const tmpPath = createTmpFileName("applescript");

  writeFileSync(tmpPath, script);

  return tmpPath;
};

const compile = (scriptPath: string, outputPath?: string): Promise<string> => {
  const out = outputPath ?? createTmpFileName("scpt");

  return new Promise(function (resolve, reject) {
    const child = exec(`osacompile -o ${out} ${scriptPath}`, (err) => {
      if (err) {
        reject(err);
      }

      resolve(out);
    });
  });
};

export const compileApplescript = (
  script: string,
  outputFile?: string
): Promise<string> => {
  const filePath = createTempScript(script);
  return compile(filePath, outputFile);
};
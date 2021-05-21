import { exec } from "child_process";
import { writeFileSync } from "fs";
import { randomName } from "./utils";
import { clearAbsoluteOutPath } from "./lib";

const { execPath } = process;

const ARRAY_SPLIT = `
on split(theString, theDelimiter)
	set oldDelimiters to AppleScript's text item delimiters
	set AppleScript's text item delimiters to theDelimiter
	set theArray to every text item of theString
	set AppleScript's text item delimiters to oldDelimiters
	return theArray
end split
`;

export const createJsWrapper = (
  scriptPath: string,
  needsSplit?: boolean
): Promise<string> => {
  const script = `
    ${needsSplit ? ARRAY_SPLIT : ""}

    set result to (do shell script "${execPath}" & " " & "${scriptPath}")
 
    return ${needsSplit ? 'split(result, ",")' : "result"}
  `;

  const outputPath = scriptPath + ".scpt";
  clearAbsoluteOutPath(outputPath);

  return compileApplescriptString(script, outputPath);
};

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

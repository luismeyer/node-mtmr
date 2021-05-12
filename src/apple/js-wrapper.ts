import { clearAbsoluteOutPath } from "../lib";

import { compileApplescriptString } from "./compile-script";

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

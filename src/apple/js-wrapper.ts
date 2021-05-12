import { clearAbsoluteOutPath } from "../utils/lib";
import { nodePath } from "../utils/node";
import { compileApplescriptString } from "./compile-script";

const ARRAY_SPLIT = `
on split(theString, theDelimiter)
	set oldDelimiters to AppleScript's text item delimiters
	set AppleScript's text item delimiters to theDelimiter
	set theArray to every text item of theString
	set AppleScript's text item delimiters to oldDelimiters
	return theArray
end split
`;

export const createJsWrapper = (scriptPath: string, needsSplit?: boolean) => {
  const script = `
    ${needsSplit ? ARRAY_SPLIT : ""}

    set result to (do shell script "${nodePath()}" & " " & "${scriptPath}")
 
    return ${needsSplit ? 'split(result, ",")' : "result"}
  `;

  const outputPath = scriptPath + ".scpt";
  clearAbsoluteOutPath(outputPath);

  return compileApplescriptString(script, outputPath);
};

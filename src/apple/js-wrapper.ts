import { clearAbsoluteOutPath } from "../utils/lib";
import { nodePath } from "../utils/node";
import { compileApplescript } from "./compile-script";

const ARRAY_SPLIT = `
on split(theString, theDelimiter)
	set oldDelimiters to AppleScript's text item delimiters
	set AppleScript's text item delimiters to theDelimiter
	set theArray to every text item of theString
	set AppleScript's text item delimiters to oldDelimiters
	return theArray
end split
`;

export const createJsWrapper = (libPath: string, needsSplit?: boolean) => {
  const script = `
    ${needsSplit ? ARRAY_SPLIT : ""}

    set result to (do shell script "${nodePath()}" & " " & "${libPath}")
 
    return ${needsSplit ? 'split(result, ",")' : "result"}
  `;

  const outputPath = libPath + ".scpt";
  clearAbsoluteOutPath(outputPath);

  return compileApplescript(script, outputPath);
};

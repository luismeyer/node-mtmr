type SourceScriptResult = string | [string, string];

export const createSourceScriptSync = (
  func: () => SourceScriptResult
): void => {
  const result = func();
  sourceOutput(result);
};

export const createSourceScript = (
  func: () => Promise<SourceScriptResult>
): void => {
  func().then(sourceOutput);
};

export const sourceOutput = (result: SourceScriptResult): void => {
  if (Array.isArray(result)) {
    console.log(`${result[0]},${result[1]}`);
  } else {
    console.log(result);
  }
};

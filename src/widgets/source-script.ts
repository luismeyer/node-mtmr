type SourceScriptResult = {
  label: string;
  imgKey?: string;
};

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

export const sourceOutput = ({ label, imgKey }: SourceScriptResult): void => {
  console.log(`${label}${imgKey ? `,${imgKey}` : ""}`);
};

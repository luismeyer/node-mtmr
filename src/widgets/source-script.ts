type SourceScriptResult = string | [string, string];

export const createSourceScriptSync = (func: () => SourceScriptResult) => {
  const result = func();

  if (Array.isArray(result)) {
    console.log(`${result[0]},${result[1]}`);
  } else {
    console.log(result);
  }
};

export const createSourceScript = (func: () => Promise<SourceScriptResult>) => {
  func().then((result) => {
    if (Array.isArray(result)) {
      console.log(`${result[0]},${result[1]}`);
    } else {
      console.log(result);
    }
  });
};

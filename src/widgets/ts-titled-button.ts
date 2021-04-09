type TsTitledScriptResult = string | [string, string];

export const createTsTitledScript = (func: () => TsTitledScriptResult) => {
  const result = func();

  if (Array.isArray(result)) {
    console.log(`${result[0]},${result[1]}`);
  } else {
    console.log(result);
  }
};

export const createAsyncTsTitledScript = (
  func: () => Promise<TsTitledScriptResult>
) => {
  func().then((result) => {
    if (Array.isArray(result)) {
      console.log(`${result[0]},${result[1]}`);
    } else {
      console.log(result);
    }
  });
};

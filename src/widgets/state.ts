import fs from "fs";

const statePath = `/tmp/node-mtmr.json`;

const readState = () => {
  if (!fs.existsSync(statePath)) {
    fs.writeFileSync(statePath, "{}");
  }

  const stateData = fs.readFileSync(statePath).toString();
  return JSON.parse(stateData);
};

const persistState = (state: any) => {
  if (!fs.existsSync(statePath)) {
    fs.writeFileSync(statePath, "{}");
  }

  fs.writeFileSync(statePath, JSON.stringify(state));
};

export const stateFunction = <T>(identifier: string) => {
  return (value: T) => {
    const newState = {
      ...readState(),
      [identifier]: value,
    };

    persistState(newState);
  };
};

export const stateValue = <T>(
  identifier: string,
  defaultValue?: T
): T | undefined => {
  const state = readState();

  if (state[identifier] === undefined) {
    persistState({
      ...state,
      [identifier]: defaultValue,
    });

    return defaultValue;
  }

  return state[identifier];
};

export const state = <T>(
  identifier: string,
  defaultValue?: T
): [T | undefined, (value: T) => void] => {
  return [
    stateValue<T>(identifier, defaultValue),
    stateFunction<T>(identifier),
  ];
};

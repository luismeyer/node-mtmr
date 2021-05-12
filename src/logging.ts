import { Config } from "./config";

export const loggerLog = (message: string): void => {
  if (!Config.loggingEnabled) {
    return;
  }

  console.log(message);
};

export const loggerInfo = (message: string): void => {
  if (!Config.loggingEnabled) {
    return;
  }

  console.info(message);
};

export const loggerError = (message: string): void => {
  if (!Config.loggingEnabled) {
    return;
  }

  console.error(message);
};

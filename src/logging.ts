import { Config } from "./config";

export const loggerLog = (message: string) =>
  Config.loggingEnabled && console.log(message);

export const loggerInfo = (message: string) =>
  Config.loggingEnabled && console.info(message);

export const loggerError = (message: string) =>
  Config.loggingEnabled && console.error(message);

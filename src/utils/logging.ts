import { getLoggingEnabled } from "../config";

export const loggerLog = (message: string) =>
  getLoggingEnabled() && console.log(message);

export const loggerInfo = (message: string) =>
  getLoggingEnabled() && console.info(message);

export const loggerError = (message: string) =>
  getLoggingEnabled() && console.error(message);

export type Configuration = {
  absoluteEntryDir: string;
  absoluteOutDir: string;
  assetsDirName: string;
  loggingEnabled?: boolean;
};

let Config: Configuration = {
  absoluteOutDir: "",
  absoluteEntryDir: "",
  assetsDirName: "",
  loggingEnabled: true,
};

export const initConfig = (newConfig: Configuration) => {
  Config = {
    ...Config,
    ...newConfig,
  };
};

export const getOutDir = () => Config.absoluteOutDir;

export const getEntryDir = () => Config.absoluteEntryDir;

export const getAssetsDirName = () => Config.assetsDirName;

export const getLoggingEnabled = () => Config.loggingEnabled;

export type Configuration = {
  absoluteOutDir: string;
  assetsDirName: string;
  loggingEnabled?: boolean;
};

let Config: Configuration = {
  absoluteOutDir: "",
  assetsDirName: "",
  loggingEnabled: true,
};

const validateConfig = () => {
  if (!getOutDir()) {
    throw new Error("Missing absolute outDir");
  }

  if (!getAssetsDirName()) {
    throw new Error("Missing absolute srcDir");
  }
};

export const initConfig = (newConfig: Configuration) => {
  Config = {
    ...Config,
    ...newConfig,
  };

  validateConfig();
};

export const getOutDir = () => Config.absoluteOutDir;

export const getAssetsDirName = () => Config.assetsDirName;

export const getLoggingEnabled = () => Config.loggingEnabled;

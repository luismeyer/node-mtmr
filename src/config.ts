import { compilerOptions } from "./lib";

export type ConfigurationOptions = {
  absoluteOutDir: string;
  assetsDirName?: string;
  modulesDirName?: string;
  loggingEnabled?: boolean;
};

export let Config = {
  absoluteOutDir: "",
  assetsDirName: "assets",
  modulesDirName: "modules",
  loggingEnabled: true,
  tsCompilerOptions: compilerOptions(),
};

const validateConfig = () => {
  if (!Config.absoluteOutDir) {
    throw new Error("Missing absolute outDir");
  }
};

export const initConfig = (newConfig: ConfigurationOptions) => {
  Config = {
    ...Config,
    ...newConfig,
  };

  validateConfig();
};

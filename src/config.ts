import { CompilerOptions, compilerOptions } from "./lib";

export type ConfigurationOptions = {
  absoluteOutDir: string;
  assetsDirName?: string;
  modulesDirName?: string;
  loggingEnabled?: boolean;
};

type Configuration = {
  absoluteOutDir: string;
  assetsDirName: string;
  modulesDirName: string;
  loggingEnabled: boolean;
  tsCompilerOptions?: CompilerOptions;
};

export let Config: Configuration = {
  absoluteOutDir: "",
  assetsDirName: "assets",
  modulesDirName: "modules",
  loggingEnabled: true,
  tsCompilerOptions: undefined,
};

const validateConfig = () => {
  if (!Config.absoluteOutDir) {
    throw new Error("Missing absolute outDir");
  }
};

export const initConfig = (newConfig: ConfigurationOptions): void => {
  Config = {
    ...Config,
    ...newConfig,
    tsCompilerOptions: compilerOptions(),
  };

  validateConfig();
};

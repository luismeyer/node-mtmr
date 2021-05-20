import { CompilerOptions, compilerOptions } from "./lib";

export type ConfigurationOptions = {
  absoluteOutDir: string;
  loggingEnabled?: boolean;
};

type Configuration = {
  absoluteOutDir: string;

  loggingEnabled: boolean;
  tsCompilerOptions?: CompilerOptions;
};

export let Config: Configuration = {
  absoluteOutDir: "",
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

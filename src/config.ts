import { CompilerOptions, compilerOptions } from "./lib";

export type ConfigurationOptions = {
  outDir: string;
  loggingEnabled?: boolean;
};

type Configuration = {
  outDir: string;
  loggingEnabled: boolean;
  tsCompilerOptions?: CompilerOptions;
};

export let Config: Configuration = {
  outDir: "",
  loggingEnabled: true,
};

const validateConfig = () => {
  if (!Config.outDir) {
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

let outDir: string;
let srcDir: string;
let assetsDirName: string;

export const setOutDir = (dir: string) => {
  outDir = dir;
};

export const getOutDir = () => outDir;

export const setEntryDir = (dir: string) => {
  srcDir = dir;
};

export const getEntryDir = () => srcDir;

export const setAssetsDirName = (dir: string) => {
  assetsDirName = dir;
};

export const getAssetsDirName = () => assetsDirName;

import { BaseItem } from "../typings/api";
import callsiteApi from "callsites";

export const createItem = <T extends BaseItem>(input: T): T => {
  const callsites = callsiteApi();

  const callsite = callsites.find(
    (callsite) => callsite.getFileName() !== __filename
  );

  return {
    ...input,
    refreshInterval: 1,
    currentPath: callsite?.getFileName(),
  };
};

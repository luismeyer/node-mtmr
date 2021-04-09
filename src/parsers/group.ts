import { parse } from ".";
import { Group } from "../typings/api";
import { MTMRGroup } from "../typings/mtmr";

export const parseGroup = async (group: Group): Promise<MTMRGroup> => {
  return {
    type: group.type,
    items: await Promise.all(group.items.map((item) => parse(item))),
  };
};

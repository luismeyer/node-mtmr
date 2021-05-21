import { parse } from ".";
import { Group } from "../typings/api";
import { MTMRGroup } from "../typings/mtmr";

export const parseGroup = async (group: Group): Promise<MTMRGroup> => {
  // parse items: if the items don't specify a currentPath it is handed down from the group root
  const items = group.items.map((item) =>
    parse({
      ...item,
      currentPath: item.currentPath ?? group.currentPath,
    })
  );

  return {
    type: group.type,
    items: await Promise.all(items),
  };
};

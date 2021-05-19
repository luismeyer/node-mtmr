import { BaseItem } from "../typings/api";
import { MTMRBaseItem } from "../typings/mtmr";
import { parseActions } from "./actions";
import { parseImage } from "./image";

export const parseBaseItem = async (
  baseItem: BaseItem
): Promise<MTMRBaseItem> => {
  return {
    align: baseItem.align,
    width: baseItem.width,
    background: baseItem.background,
    title: baseItem.title,
    bordered: baseItem.bordered,
    refreshInterval: baseItem.refreshInterval,
    image: parseImage(baseItem.image),
    actions: await parseActions(baseItem),
  };
};

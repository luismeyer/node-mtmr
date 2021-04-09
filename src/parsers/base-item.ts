import { BaseItem } from "../typings/api";
import { MTMRBaseItem } from "../typings/mtmr";
import { parseActions } from "./actions";
import { parseImage } from "./image";

export const parseBaseItem = async (
  baseItem: BaseItem
): Promise<MTMRBaseItem> => {
  return {
    ...baseItem,
    image: baseItem.image && parseImage(baseItem.image),
    actions: baseItem.actions && (await parseActions(baseItem.actions)),
  };
};

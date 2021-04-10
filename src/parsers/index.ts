import { Item } from "../typings/api";
import { MTMRItem } from "../typings/mtmr";
import { parseBaseItem } from "./base-item";
import { parseGroup } from "./group";
import { parseScriptTitledButton } from "./script-titled-button";

export const parse = async (item: Item): Promise<MTMRItem> => {
  const baseItem = await parseBaseItem(item);

  let pureItem: MTMRItem;

  switch (item.type) {
    case "scriptTitledButton":
      pureItem = await parseScriptTitledButton(item);
      break;
    case "group":
      pureItem = await parseGroup(item);
      break;
    default:
      pureItem = {
        ...item,
        actions: baseItem.actions,
      };
  }

  return {
    ...baseItem,
    ...pureItem,
  };
};

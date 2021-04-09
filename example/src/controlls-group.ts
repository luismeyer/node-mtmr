import { MTMRGroup } from "node-mtmr";

export const ControllsGroup: MTMRGroup = {
  type: "group",
  align: "right",
  title: "🖥",
  items: [
    {
      type: "brightnessDown",
      align: "left",
    },
    {
      type: "brightness",
      width: 150,
      align: "left",
    },
    {
      type: "brightnessUp",
      align: "left",
    },
    {
      type: "volumeDown",
      align: "left",
    },
    {
      type: "volume",
      width: 150,
      align: "left",
    },
    {
      type: "volumeUp",
      align: "left",
    },
    {
      type: "close",
      align: "right",
    },
  ],
};

import { extname } from "path";

export const randomName = (): string =>
  `${new Date().getTime()}${Math.floor(Math.random() * (10000 + 1))}`;

export const isFile = (path: string): boolean => Boolean(extname(path));

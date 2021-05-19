export const randomName = (): string =>
  `${new Date().getTime()}${Math.floor(Math.random() * (10000 + 1))}`;

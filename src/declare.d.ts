declare module "copy-dir" {
  function sync(
    from: string,
    to: string,
    options?: {
      utimes: boolean;
      mode: boolean;
      cover: boolean;
    }
  ): void;
}

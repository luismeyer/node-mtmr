export type Base64Image = {
  base64: string;
};

export type FilePathImage = {
  filePath: string;
};

export type Image = Base64Image | FilePathImage;

export type AlternativeImages = {
  [key: string]: Image;
};

export type InlineSource = {
  inline: string;
};

export type JsInlineSource = {
  inline: () => void;
};

export type FilePathSource = {
  filePath: string;
};

export type Base64Source = {
  base64: string;
};

export type Source = InlineSource | FilePathSource | Base64Source;
export type JsSource = FilePathSource | JsInlineSource;

export type MTMRBase64Image = {
  base64: string;
};

export type MTMRFilePathImage = {
  filePath: string;
};

export type MTMRImage = MTMRBase64Image | MTMRFilePathImage;

export type MTMRAlternativeImages = {
  [key: string]: MTMRImage;
};

export type MTMRInlineSource = {
  inline: string;
};

export type MTMRFilePathSource = {
  filePath: string;
};

export type MTMRBase64Source = {
  base64: string;
};

export type MTMRSource =
  | MTMRInlineSource
  | MTMRFilePathSource
  | MTMRBase64Source;

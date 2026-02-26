export const GetMediaType = (filePath: string) => {
  const split = filePath.split(".");
  const extension = split[split.length - 1];
  switch (extension) {
    case "jpeg":
    case "jpg":
    case "png":
    case "heic":
      return `image/${extension}`;
    case "pdf":
      return `application/pdf`;
    case "mp4":
      return `video/${extension}`;
    case "mov":
      return "video/quicktime";
    case "mp4":
    case "m4a":
      return `audio/${extension}`;
    default:
      return "";
  }
};

export const CreateFileName = (filePath: string) => {
  const split = filePath.split("/");
  const name = `${split[split.length - 1]}`;
  return name;
};

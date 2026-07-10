import { formatReadableDate } from "./readableDate.js";
import { middleEllipsis } from "./stringEllipsisMiddle.js";

export function reformatAllDataObject(allData) {
  const folders = allData?.folders;

  folders.forEach((folder) => {
    const posts = folder.posts;

    posts.forEach((post) => {
      reformatPostDataObject(post);
    });
  });

  return allData;
}

export function reformatPostDataObject(post) {
  //#region  Converts mime in the post object to a extension
  const mime = post.file_ext;

  const mimeObj = {
    jpeg: "jpg",
    png: "png",
    gif: "gif",
    webp: "webp",
    avif: "avif",
    "svg+xml": "svg",
    bmp: "bmp",
    "x-icon": "ico",
    "vnd.microsoft.icon": "ico",
    apng: "apng",
    tiff: "tiff",
  };

  const extension = mimeObj[mime];

  post.file_ext = extension;
  //#endregion

  //#region Creates different versions of the file name
  const fileName = post.file_name;

  const file_name_without_extension = fileName.substring(
    0,
    fileName.lastIndexOf("."),
  ); // removes the extension
  post.file_name_without_extension = file_name_without_extension;

  post.file_name_short = middleEllipsis(fileName);
  //#endregion

  //#region Converts ISO dates into readble dates
  post.readableCreationDate = formatReadableDate(post.uploaded_at);
  post.readableExpiryDate = formatReadableDate(post.expires_at);
  //#endregion

  return post;
}

import { middleEllipsis } from "./stringEllipsisMiddle.js";

import path from "path";

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
  //#region Creates different versions of the file name
  const fileName = post.file_name;

  post.file_ext = path.extname(fileName);

  post.file_name_without_extension = path.basename(fileName, post.file_ext);

  post.file_name_short = `${middleEllipsis(post.file_name_without_extension)}${post.file_ext}`;

  //#endregion

  return post;
}

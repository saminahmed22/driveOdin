export function findPostFromAllData(targetPostID, allData) {
  const folders = allData?.folders;

  if (!folders) {
    throw new Error(`No folder is available to iterate through.`);
  }

  for (const folder of folders) {
    const targetPost = folder.posts.find((post) => post.id === targetPostID);

    if (targetPost) {
      return targetPost;
    }
  }

  throw new Error(`Cannot find the post with post ID: ${targetPostID}`);
}

export function findFolderFromAllData(targetFolderID, allData) {
  const folders = allData?.folders;

  if (!folders) {
    throw new Error(`No folder is available to iterate through.`);
  }

  const targetFolder = folders?.targetFolderID;

  if (targetFolder) {
    return targetFolder;
  }

  throw new Error(`Cannot find the folder with folder ID: ${targetFolderID}`);
}

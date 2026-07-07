// Modles
import { createFolderDB, getFolders } from "../models/post.model.js";

export async function renderIndex(req, res) {
  let folders;
  if (req.user) {
    folders = await getFolders(req.user.id);
  }

  res.render("index", {
    data: { folders },
    modalOpen: null,
    errors: {},
  });
}

export async function createFolder(req, res, next) {
  const folder_name = req.body.folderName;
  const userId = req.user.id;

  const data = { folder_name, userId };

  await createFolderDB(data);

  res.redirect("/");
}

// Modles
import {
  submitCreateFolder,
  getFolder,
  getFolders,
  submitEditFolder,
  submitDeleteFolder,
} from "../models/folder.model.js";

export async function createFolder(req, res, next) {
  const folder_name = req.body.folderName;
  const userId = req.user.id;

  const data = { folder_name, userId };

  await submitCreateFolder(data);

  res.redirect("/");
}

export async function findFolder(req, res, next) {
  const id = req.params.id;

  const folder = await getFolder(id);

  req.folder = folder;

  next();
}

export async function editFolder(req, res, next) {
  return null;
}

export async function deleteFolder(req, res, next) {
  await submitDeleteFolder(req.params.id);

  res.redirect("/");
}

export async function renderFolderPage(data) {
  return null;
}

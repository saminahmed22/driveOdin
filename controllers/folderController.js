// Modles
import {
  submitCreateFolder,
  getFolder,
  getFolders,
  submitEditFolder,
  submitDeleteFolder,
} from "../models/folderModel.js";

// Utils
import { findFolderFromAllData } from "../utils/iterateObject.js";

export async function createFolder(req, res, next) {
  const folder_name = req.body.folderName;
  const userId = req.user.id;

  const data = { folder_name, userId };

  await submitCreateFolder(data);

  res.redirect("/");
}

export async function renderFolderEditPopver(req, res, next) {
  const folder = findFolderFromAllData(req.params.id, req.data);

  res.render("index", {
    allData: req.data,
    modalOpen: "editFolder",
    values: { folder },
    errors: {},
  });
}

export async function editFolder(req, res, next) {
  await submitEditFolder(req.params.id, req.body.folder_name);

  res.redirect("/");
}

export async function renderFolderDeletePopver(req, res, next) {
  const folder = findFolderFromAllData(req.params.id, req.data);

  res.render("index", {
    allData: req.data,
    modalOpen: "deleteFolder",
    values: { folder },
    errors: {},
  });
}

export async function deleteFolder(req, res, next) {
  const allFolders = req.data.folders;

  if (allFolders.length > 1) {
    await submitDeleteFolder(req.params.id);

    res.redirect("/");
  } else {
    throw new Error("Cannot delete last folder.");
  }
}

export async function renderFolderPage(data) {
  return null;
}

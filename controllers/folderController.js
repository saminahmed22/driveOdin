// Modles
import {
  createFolder,
  editFolder,
  deleteFolder,
  findFolder,
  getAllFolders,
} from "../models/folderModel.js";

// Utils
import { findFolderFromAllData } from "../utils/iterateObject.js";

export async function handleCreateFolderRequest(req, res, next) {
  const folder_name = req.body.folder_name;
  const userId = req.user.id;

  const data = { folder_name, userId };

  await createFolder(data);

  res.redirect("/");
}

export async function renderFolderEditPopver(req, res, next) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const folder = findFolderFromAllData(req.params.id, req.data);

  res.render("index", {
    allData: req.data,
    modalOpen: "editFolder",
    values: { folder },
    errors: {},
  });
}

export async function handleEditFolderRequest(req, res, next) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const folderID = req.params.id;
  const userID = req.user.id;
  const data = { folder_name: req.body.folder_name };

  await editFolder(folderID, userID, data);

  res.redirect("/");
}

export async function renderFolderDeletePopver(req, res, next) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const folder = findFolderFromAllData(req.params.id, req.data);

  res.render("index", {
    allData: req.data,
    modalOpen: "deleteFolder",
    values: { folder },
    errors: {},
  });
}

export async function handleDeleteFolderRequest(req, res, next) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const allFolders = req.data.folders;

  if (allFolders.length > 1) {
    const folderID = req.params.id;
    const userID = req.user.id;

    await deleteFolder(folderID, userID);

    res.redirect("/");
  } else {
    throw new Error("Cannot delete last folder.");
  }
}

export async function renderFolderPage(data) {
  return null;
}

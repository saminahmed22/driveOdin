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
import { reformatAllDataObject } from "../utils/reformatAllDataObject.js";
import { generateQR } from "../utils/generateQRcode.js";

//#region Create folder
export async function handleCreateFolderRequest(req, res, next) {
  const folder_name = req.body.folder_name;
  const userId = req.user.id;

  const data = { folder_name, userId };

  await createFolder(data);

  res.redirect("/");
}
//#endregion

//#region Edit folder
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
//#endregion

//#region Delete folder
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
//#endregion

//#region Share folder
export async function renderFolderPage(req, res, next) {
  const folderID = req.params.id;
  const folder = req.folder;

  res.render("index", {
    allData: req.data,
    modalOpen: "folderSharePage",
    values: { folder },
    errors: {},
  });
}

export async function getFolder(req, res, next) {
  const authorStatus = req.isAuthor;

  const folderID = req.params.id;

  const folder = authorStatus
    ? findFolderFromAllData(folderID, req.data)
    : await findFolder(folderID);

  if (!folder) {
    throw new Error(`No folder has been found with the folder ID: ${folderID}`);
  }

  // Source - https://stackoverflow.com/a/10185427
  // Posted by Peter Lyons, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-07-06, License - CC BY-SA 3.0
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  folder.shareUrl = fullUrl;

  const qrcode = await generateQR(fullUrl);
  folder.qrcode = qrcode;

  req.folder = folder;

  next();
}
//#endregion

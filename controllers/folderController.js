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

import { ZipArchive } from "archiver";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { validationResult } from "express-validator";

//#region Create folder
export async function renderFolderCreatePopver(req, res) {
  const formValidationErrors = validationResult(req);

  let folderNameValidationError;
  formValidationErrors.errors.forEach((error) => {
    if (error.path === "folder_name") {
      folderNameValidationError = error.msg;
    }
  });

  const hasErrors = !formValidationErrors.isEmpty();

  res.status(hasErrors ? 400 : 200).render("index", {
    allData: req.data,
    modalOpen: "createFolder",
    values: { folder_name: req?.body?.folder_name },
    errorMessages: {
      validationErrors: {
        folder_name: folderNameValidationError,
      },
    },
  });
}

export async function handleCreateFolderRequest(req, res, next) {
  const folder_name = req.body.folder_name;
  const userId = req.user.id;

  const data = { folder_name, userId };

  await createFolder(data);

  res.redirect("/");
}
//#endregion

//#region Edit folder
export async function renderFolderEditPopver(req, res) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const folder = findFolderFromAllData(req.params.id, req.data);

  const formValidationErrors = validationResult(req);

  let folderNameValidationError;
  formValidationErrors.errors.forEach((error) => {
    if (error.path === "folder_name") {
      folderNameValidationError = error.msg;
    }
  });

  const hasErrors = !formValidationErrors.isEmpty();

  if (hasErrors) {
    res.render("index", {
      allData: req.data,
      modalOpen: "editFolder",
      values: {
        folder: { id: req.params.id, folder_name: req?.body?.folder_name },
      },
      errorMessages: {
        validationErrors: {
          folder_name: folderNameValidationError,
        },
      },
    });
  } else {
    res.render("index", {
      allData: req.data,
      modalOpen: "editFolder",
      values: { folder },
      errorMessages: {},
    });
  }
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

export async function handleFolderDownloadRequest(req, res, next) {
  const folderID = req.params.id;
  const folder = await findFolder(folderID);

  const zipNameUUID = `${folder.folder_name}-${crypto.randomUUID()}.zip`;

  const outputPath = path.join(os.tmpdir(), zipNameUUID);

  const output = fs.createWriteStream(outputPath);

  const archive = new ZipArchive({
    store: true,
  });

  output.on("close", () => {
    const zipName = `${folder.folder_name}.zip`;
    res.download(outputPath, zipName, (err) => {
      if (err) {
        console.error(`Error in downloading the zip: ${err}`);
      }

      fs.unlink(outputPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error(
            `Failed to delete zip from temp directory: ${unlinkErr}`,
          );
        }
      });
    });
  });

  archive.on("error", (err) => {
    throw new Error(err);
  });

  archive.pipe(output);

  folder.posts.forEach((post) => {
    const filePath = post.location;
    const fileBuffer = fs.createReadStream(filePath);

    archive.append(fileBuffer, { name: post.file_name });
  });

  archive.finalize();
}
//#endregion

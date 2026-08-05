// Modles
import {
  createFolder,
  editFolder,
  deleteFolder,
  findFolder,
  getAllFolders,
} from "../models/folderModel.js";

// Controllers
import { removeDataFromSession } from "./postController.js";

// Utils
import { findFolderFromAllData } from "../utils/iterateObject.js";
import { reformatAllDataObject } from "../utils/reformatAllDataObject.js";
import { generateQR } from "../utils/generateQRcode.js";
import { hashString } from "../utils/crypto.js";
import { compareHash } from "../utils/crypto.js";

import { ZipArchive } from "archiver";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";
import { validationResult } from "express-validator";
import { Readable } from "stream";

// Supabase
import { supabase } from "../lib/supabase.js";

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
  const folder_password = req.body.folderPassword;
  const isProtected = folder_password?.length > 0;

  let passwordHash;
  if (isProtected) {
    passwordHash = await hashString(folder_password);
  }

  const userId = req.user.id;

  const data = { folder_name, isProtected, passwordHash, userId };

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

  if (folder?.posts?.length) {
    await Promise.all(
      folder.posts.map(async (post) => {
        const { data, error } = await supabase.storage
          .from("DriveOdinBucket")
          .createSignedUrl(post.location, 60 * 15);

        if (error) {
          throw new Error(
            `Failed to sign URL for post ${post.id}: ${error.message}`,
          );
        }

        post.location = data.signedUrl;
      }),
    );
  }

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

  if (allFolders.length < 1) {
    throw new Error("Cannot delete last folder.");
  }

  const folderID = req.params.id;
  const userID = req.user.id;
  const folder = findFolderFromAllData(folderID, req.data);

  const paths = folder.posts.map((post) => post.location);

  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("DriveOdinBucket")
      .remove(paths);

    if (storageError) {
      throw new Error(
        `Failed to delete files from storage: ${storageError.message}`,
      );
    }
  }

  await deleteFolder(folderID, userID);

  res.redirect("/");
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

  // Adds supabase image url on every post
  await Promise.all(
    (folder?.posts ?? []).map(async (post) => {
      const { data, error } = await supabase.storage
        .from("DriveOdinBucket")
        .createSignedUrl(post.location, 60 * 15);

      if (error) {
        throw new Error(
          `Failed to sign URL for post ${post.id}: ${error.message}`,
        );
      }

      post.location = data.signedUrl;
    }),
  );

  const isProtected = folder.isProtected;

  if (isProtected && !authorStatus) {
    const givenPassword = req?.session?.password;

    if (!givenPassword) {
      res.redirect(`/folder/passwordRequired/${folderID}`);

      return;
    }

    /*
      Removes password stored in the session
      after accessing it the first time
    */

    const isGenuine = await compareHash(givenPassword, folder.passwordHash);

    if (!isGenuine) {
      res.redirect(`/folder/passwordRequired/${shareCode}`);

      return;
    }
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
  const authorStatus = req.isAuthor;

  const folderID = req.params.id;
  const folder = await findFolder(folderID);

  const isProtected = folder.isProtected;

  if (isProtected && !authorStatus) {
    const givenPassword = req?.session?.password;

    if (!givenPassword) {
      res.redirect(`/folder/passwordRequired/${folderID}`);

      return;
    }

    /*
      Removes password stored in the session
      after accessing it the first time
    */
    removeDataFromSession(req, res);

    const isGenuine = await compareHash(givenPassword, folder.passwordHash);

    if (!isGenuine) {
      res.redirect(`/folder/passwordRequired/${folderID}`);

      return;
    }
  }

  if (!folder) {
    throw new Error(`No folder found with ID: ${folderID}`);
  }

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

  // Stream each file into the archive one at a time
  for (const post of folder.posts) {
    const { data, error } = await supabase.storage
      .from("DriveOdinBucket")
      .download(post.location);

    if (error) {
      throw new Error(`Failed to download ${post.file_name}: ${error.message}`);
    }

    const nodeStream = Readable.fromWeb(data.stream());

    // Wait for this file to be fully appended before moving to the next
    await new Promise((resolve, reject) => {
      archive.append(nodeStream, { name: post.file_name });
      nodeStream.on("end", resolve);
      nodeStream.on("error", reject);
    });
  }

  archive.finalize();
}
//#endregion

import "dotenv/config";

// Models
import {
  createPost,
  editPost,
  deletePost,
  findPost,
} from "../models/postModel.js";

import { findFolder } from "../models/folderModel.js";

// Utils
import { generateQR } from "../utils/generateQRcode.js";
import { middleEllipsis } from "../utils/stringEllipsisMiddle.js";
import { formatReadableSize } from "../utils/readableFileSize.js";
import { hashString, compareHash } from "../utils/crypto.js";
import {
  findPostFromAllData,
  findFolderFromAllData,
} from "../utils/iterateObject.js";
import { reformatPostDataObject } from "../utils/reformatAllDataObject.js";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { validationResult } from "express-validator";
import Crypto from "crypto";

// Models
import { isAuthor } from "../models/authModel.js";

// Supabase
import { supabase } from "../lib/supabase.js";

//#region Create post
export async function renderUploadForm(req, res) {
  const formValidationErrors = validationResult(req);

  let fileValidationError,
    fileNameValidationError,
    folderValidationError,
    expiryDateValidationError;
  formValidationErrors.errors.forEach((error) => {
    if (error.path === "selected_image") {
      fileValidationError = error.msg;
    } else if (error.path === "file_name") {
      fileNameValidationError = error.msg;
    } else if (error.path === "selected_folder") {
      folderValidationError = error.msg;
    } else if (error.path === "expiryDate") {
      expiryDateValidationError = error.msg;
    }
  });

  const hasErrors = !formValidationErrors.isEmpty();

  res.status(hasErrors ? 400 : 200).render("index", {
    allData: req.data,
    modalOpen: "uploadForm",
    values: {
      folderSelected: req?.body?.selected_folder,
      password: req?.body?.postPassword,
      expires_at: req?.body?.expiryDate,
    },
    errorMessages: {
      validationErrors: {
        file: fileValidationError,
        file_name: fileNameValidationError,
        folderSelected: folderValidationError,
        expires_at: expiryDateValidationError,
      },
    },
  });
}

export async function handleCreatePostRequest(req, res, next) {
  const userId = req.user.id;

  // File name
  const givenFileName = req.body.file_name;
  const file_ext = path.extname(req.file.originalname);

  const file_name = `${givenFileName}${file_ext}`;

  // File size
  const file_size = formatReadableSize(req.file.size);

  //Supabase upload
  const storagePath = `${Crypto.randomUUID()}${file_ext}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("DriveOdinBucket")
    .upload(storagePath, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  // File path
  const location = uploadData.path;

  // Password
  const isProtected = req.body.postPassword.length > 0;

  let passwordHash;
  if (isProtected) {
    const password = req.body.postPassword;

    passwordHash = await hashString(password);
  }

  // Expiry date
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + parseInt(req.body.expiryDate));

  // Folder
  const folderId = req.body.selected_folder;

  //
  const data = {
    userId,
    file_name,
    file_size,
    location,
    isProtected,
    passwordHash,
    expires_at,
    folderId,
  };

  const post = await createPost(data);

  req.post = post;

  next();
}
//#endregion

//#region Edit post
export async function renderFileEditModal(req, res, next) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const postID = req.params.id;
  const post = findPostFromAllData(postID, req.data);

  const fileName = path.basename(post.location);
  const newLocation = `/uploads/${fileName}`;

  // Get supabase image url
  const { data, error } = await supabase.storage
    .from("DriveOdinBucket")
    .createSignedUrl(post.location, 60 * 15);

  post.location = data.signedUrl;

  post.file_ext = path.extname(post.file_name);

  // Validator
  const formValidationErrors = validationResult(req);

  let fileNameValidationError;
  formValidationErrors.errors.forEach((error) => {
    if (error.path === "file_name") {
      fileNameValidationError = error.msg;
    }
  });

  const hasErrors = !formValidationErrors.isEmpty();

  if (hasErrors) {
    post.file_name_without_extension = req.body.file_name;

    res.render("index", {
      allData: req.data,
      modalOpen: "editFile",
      values: { post },
      errorMessages: {
        validationErrors: {
          file_name: fileNameValidationError,
        },
      },
    });
  } else {
    res.render("index", {
      allData: req.data,
      modalOpen: "editFile",
      values: { post },
      errorMessages: {},
    });
  }
}

export async function handleEditPostRequest(req, res, next) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const post = findPostFromAllData(req.params.id, req.data);

  const file_ext = post.file_ext;

  const file_name = `${req.body.file_name}${file_ext}`;

  const postID = req.params.id;
  const userID = req.user.id;
  const data = { file_name };

  await editPost(postID, userID, data);

  res.redirect("/");
}
//#endregion

//#region Delete post
export async function renderFileDeleteModal(req, res, next) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const post = findPostFromAllData(req.params.id, req.data);

  const fileName = path.basename(post.location);
  const newLocation = `/uploads/${fileName}`;

  // Get supabase image url
  const { data, error } = await supabase.storage
    .from("DriveOdinBucket")
    .createSignedUrl(post.location, 60 * 15);

  post.location = data.signedUrl;

  res.render("index", {
    allData: req.data,
    modalOpen: "deleteFile",
    values: { post },
    errors: {},
  });
}

export async function handleDeletePostRequest(req, res, next) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const postID = req.params.id;
  const userID = req.user.id;
  const post = findPostFromAllData(postID, req.data);

  const { error: storageError } = await supabase.storage
    .from("DriveOdinBucket")
    .remove([post.location]);

  if (storageError) {
    throw new Error(
      `Failed to delete file from storage: ${storageError.message}`,
    );
  }

  await deletePost(postID, userID);

  res.redirect("/");
}
//#endregion

//#region Share/Download request related function
export async function renderDownloadForm(req, res, error) {
  const formValidationErrors = validationResult(req);

  let shareCodeValidationError, passwordValidationError;
  formValidationErrors.errors.forEach((error) => {
    if (error.path === "shareCode") {
      shareCodeValidationError = error.msg;
    } else if (error.path === "password") {
      passwordValidationError = error.msg;
    }
  });

  const hasErrors = !formValidationErrors.isEmpty();

  const requestType = req.originalUrl.split("/").includes("post")
    ? "post"
    : "folder";

  res.status(hasErrors ? 400 : 200).render("index", {
    allData: req.data,
    modalOpen: "downloadForm",
    values: {
      shareCode: req?.params?.id || req?.body?.shareCode,
      requestType,
      password: req?.body?.password,
    },
    errorMessages: {
      validationErrors: {
        shareCode: shareCodeValidationError,
        password: passwordValidationError,
      },
    },
  });
}

export async function getImage(req, res, next) {
  const authorStatus = req.isAuthor;

  const postID = req.params.id;

  const post = authorStatus
    ? findPostFromAllData(postID, req.data)
    : await findPost(postID);

  if (!post) {
    throw new Error(`No post has been found with the post ID HERE: ${postID}`);
  }

  const isProtected = post.isProtected;

  if (isProtected) {
    if (!authorStatus) {
      const givenPassword = req?.session?.password;

      if (!givenPassword) {
        res.redirect(`/post/passwordRequired/${postID}`);

        return;
      }

      /*
      Removes password stored in the session
      after accessing it the first time
      */
      removeDataFromSession(req, res);

      const isGenuine = await compareHash(givenPassword, post.passwordHash);

      if (!isGenuine) {
        res.redirect(`/post/passwordRequired/${shareCode}`);

        return;
      }
    }
  }

  // Get supabase image url
  const { data, error } = await supabase.storage
    .from("DriveOdinBucket")
    .createSignedUrl(post.location, 60 * 15);

  post.location = data.signedUrl;

  // Source - https://stackoverflow.com/a/10185427
  // Posted by Peter Lyons, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-07-06, License - CC BY-SA 3.0
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
  post.shareUrl = fullUrl;

  const qrcode = await generateQR(fullUrl);
  post.qrcode = qrcode;

  req.post = authorStatus ? post : reformatPostDataObject(post);

  next();
}

export async function renderDownloadPage(req, res, next) {
  const post = req.post;

  res.render("index", {
    allData: req?.data,
    modalOpen: "downloadPage",
    values: { post },
    errors: [],
  });
}

export async function renderPasswordRequriedForm(req, res, next) {
  const requestType = req?.originalUrl?.split("/")?.includes("post")
    ? "post"
    : "folder";

  const ID = req?.params?.id;

  const formValidationErrors = validationResult(req);

  let passwordValidationError;
  formValidationErrors.errors.forEach((error) => {
    if (error.path === "password") {
      passwordValidationError = error.msg;
    }
  });

  const hasErrors = !formValidationErrors.isEmpty();

  res.status(hasErrors ? 400 : 200).render("index", {
    allData: req?.data,
    modalOpen: "passwordRequired",
    values: { requestType, ID },
    errorMessages: {
      validationErrors: {
        password: passwordValidationError,
      },
    },
  });
}

export async function handlePostDownloadRequest(req, res, next) {
  const postID = req.params.id;
  const post = await findPost(postID);

  if (!post) {
    throw new Error(`No post found with ID: ${postID}`);
  }

  const { data, error } = await supabase.storage
    .from("DriveOdinBucket")
    .download(post.location);

  if (error) {
    throw new Error(`Failed to download ${post.file_name}: ${error.message}`);
  }

  const buffer = Buffer.from(await data.arrayBuffer());

  res.set("Content-Disposition", `attachment; filename="${post.file_name}"`);
  res.set("Content-Type", data.type);
  res.send(buffer);
}
//#endregion

//#region

// Stores user given password for locked posts on session temporarily
// as the router redirects users to post view route on submission
export function addDataToSession(req, res, next) {
  req.session.password = req.body.password;

  req.session.save((err) => {
    if (err) return next(err);
    next();
  });
}

export async function removeDataFromSession(req, res) {
  req.session.password = "";

  return;
}
//#endregion

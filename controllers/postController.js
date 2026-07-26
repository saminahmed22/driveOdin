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

// Models
import { isAuthor } from "../models/authModel.js";

// Multer
import { uploadImageMulter } from "../lib/multer.js";

//#region Create post
export async function renderUploadForm(req, res) {
  res.render("index", {
    allData: req.allData,

    modalOpen: "uploadForm",
    errors: {},
  });
}

export async function handleCreatePostRequest(req, res, next) {
  await uploadImageMulter(req, res);

  const userId = req.user.id;

  // File name
  const givenFileName = req.body.file_name;
  const file_ext = path.extname(req.file.originalname);

  const file_name = `${givenFileName}${file_ext}`;

  // File size
  const file_size = formatReadableSize(req.file.size);

  // File path
  const dir = path.dirname(req.file.path);
  const location = `${dir}/${file_name}`;

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

  post.file_ext = path.extname(post.file_name);

  res.render("index", {
    allData: req.data,
    modalOpen: "editFile",
    values: { post },
    errors: {},
  });
}

export async function handleEditPostRequest(req, res, next) {
  if (!req.isAuthor) {
    res.redirect("/");

    return;
  }

  const post = findPostFromAllData(req.params.id, req.data);

  const file_ext = post.file_ext;

  const file_name = `${req.body.file_name}${file_ext}`;

  const dir = path.dirname(post.location);
  const newPath = `${dir}/${file_name}`;
  fs.rename(post.location, newPath, (err) => {
    if (err) {
      throw new Error(err);
    }
  });

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

  await deletePost(postID, userID);

  res.redirect("/");
}
//#endregion

//#region Share/Download request related function
export async function renderDownloadForm(req, res, error) {
  res.render("index", {
    allData: req.data,
    modalOpen: "downloadForm",
    values: { shareCode: req?.params?.id },
    errors: { error: error },
  });
}

export async function getImage(req, res, next) {
  const authorStatus = req.isAuthor;

  const postID = req.params.id;

  const post = authorStatus
    ? findPostFromAllData(postID, req.data)
    : await findPost(postID);

  if (!post) {
    throw new Error(`No post has been found with the post ID: ${postID}`);
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

      const isGenuine = compareHash(givenPassword, post.passwordHash);

      if (!isGenuine) {
        res.redirect(`/post/passwordRequired/${shareCode}`);

        return;
      }
    }
  }

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
  const postID = req.params.id;

  res.render("index", {
    allData: req?.data,
    modalOpen: "passwordRequired",
    values: { postID },
    errors: [],
  });
}
//#endregion

//#region

// Stores user given password for locked posts on session temporarily
// as the router redirects users to post view route on submission
export function addDataToSession(req, res, next) {
  req.session.password = req.body.postPassword;

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

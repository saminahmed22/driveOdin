// Models
import {
  isPostProtected,
  decryptPost,
  createPost,
  getPost,
  submitEditFile,
  submitDeleteFile,
} from "../models/postModel.js";

import { getFolders } from "../models/folderModel.js";

// Utils

import { generateQR } from "../utils/generateQRcode.js";
import { middleEllipsis } from "../utils/stringEllipsisMiddle.js";
import { formatReadableSize } from "../utils/readableFileSize.js";
import { encryptString } from "../utils/crypto.js";
import {
  findPostFromAllData,
  findFolderFromAllData,
} from "../utils/iterateObject.js";
import { reformatPostDataObject } from "../utils/reformatAllDataObject.js";
import fs from "fs";
import path from "path";

// Multer
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/samin-ahmed/repos/driveOdin/uploads");
  },

  filename: function (req, file, cb) {
    //#region File name
    const originalFileName = file.originalname;

    const file_ext = path.extname(originalFileName);

    const givenFileName = req.body.file_name;

    const file_name = `${givenFileName}${file_ext}`;
    //#endregion

    cb(null, file_name);
  },
});

const upload = multer({ storage: storage });

// multer function
export function uploadImage(req, res, next) {
  const singleUpload = upload.single("selected_image");

  singleUpload(req, res, (err) => {
    if (err) {
      return next(err);
    }

    next();
  });
}

export async function uploadPost(req, res, next) {
  const userId = req.user.id;
  const originalFileName = req.file.originalname;

  //#region File extension type
  const fileMime = req.file.mimetype;

  const fileMimeSplit = fileMime.split("/");

  const validPhotoMimeTypes = [
    "jpeg",
    "png",
    "gif",
    "webp",
    "avif",
    "svg+xml",
    "bmp",
    "x-icon",
    "vnd.microsoft.icon",
    "apng",
    "tiff",
  ];

  const isValidExt = validPhotoMimeTypes.includes(fileMimeSplit[1]);
  if (!isValidExt) {
    throw new Error("Unsupported photo extension.");
  }

  const file_ext = path.extname(originalFileName);
  //#endregion

  //#region File name
  const givenFileName = req.body.file_name;

  const file_name = `${givenFileName}${file_ext}`;
  //#endregion

  //#region File path
  const isProtected = req.body.postPassword.length > 0;

  const dir = path.dirname(req.file.path);
  const file_location = `${dir}/${file_name}`;

  const password = req.body.postPassword;

  const location = isProtected
    ? encryptString(file_location, password)
    : file_location;
  //#endregion

  const file_size = formatReadableSize(req.file.size);

  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + parseInt(req.body.expiryDate));

  const folderId = req.body.selected_folder;

  const data = {
    userId,
    file_name,
    isProtected,
    location,
    file_size,
    file_ext,
    expires_at,
    folderId,
  };

  const post = await createPost(data);

  req.post = post;

  next();
}

export async function renderUploadForm(req, res) {
  res.render("index", {
    allData: req.allData,

    modalOpen: "uploadForm",
    errors: {},
  });
}

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
  const postID = req.params.id;

  const post = req.user
    ? findPostFromAllData(postID, req.data)
    : await getPost(postID);

  if (!post) {
    throw new Error(`No post has been found with the post ID: ${postID}`);
  }

  const isProtected = post.isProtected;

  let givenPassword, decryptedPost;
  if (isProtected) {
    givenPassword = req?.session?.password;

    if (!givenPassword) {
      res.redirect(`/post/passwordRequired/${postID}`);

      return;
    }

    /*
    Removes password stored in the session
    after accessing it the first time
    */
    removeDataFromSession(req, res);

    decryptedPost = decryptPost(post, givenPassword);

    if (decryptedPost instanceof Error) {
      if (post.message === "password") {
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

  post.file_name_short = middleEllipsis(post.file_name);

  if (!req.user) {
    req.post = post;
  }

  next();
}

export async function renderDownloadPage(req, res) {
  const post = req.user
    ? findPostFromAllData(req.params.id, req.data)
    : req.post;

  res.render("index", {
    allData: req?.data,
    modalOpen: "downloadPage",
    values: { ...post },
    errors: [post.message],
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

export async function renderFileEditModal(req, res, next) {
  const postID = req.params.id;
  const post = findPostFromAllData(postID, req.data);

  const isProtected = post.isProtected;

  let givenPassword, decryptedPost;
  if (isProtected) {
    givenPassword = req?.session?.password;

    if (!givenPassword) {
      res.redirect(`/post/edit/passwordRequired/${postID}`);

      return;
    }

    // /*
    // Removes password stored in the session after 5 minutes
    // */
    // setTimeout((req, res) => {
    //   removeDataFromSession(req, res);
    // }, 300000);

    decryptedPost = decryptPost(post, givenPassword);

    if (decryptedPost instanceof Error) {
      if (post.message === "password") {
        res.redirect(`/post/edit/passwordRequired/${postID}`);

        return;
      }
    }
  }

  res.render("index", {
    allData: req.data,
    modalOpen: "editFile",
    values: { post },
    errors: {},
  });
}

export async function renderEditFilePasswordRequiredModal(req, res, next) {
  const postID = req.params.id;
  const post = findPostFromAllData(postID, req.data);

  res.render("index", {
    allData: req.data,
    modalOpen: "editPostPasswordRequired",
    values: { post },
    errors: {},
  });
}

export async function editFile(req, res, next) {
  const post = findPostFromAllData(req.params.id, req.data);

  const isPostProtected = post.isProtected;

  let givenPassword;
  if (isPostProtected) {
    givenPassword = req?.session?.password;

    if (!givenPassword) {
      res.redirect(`/post/edit/passwordRequired/${postID}`);

      return;
    }

    /*
    Removes password stored in the session
    after accessing it the first time
    */
    removeDataFromSession(req, res);

    const decryptedPost = decryptPost(post, givenPassword);

    if (decryptedPost instanceof Error) {
      if (post.message === "password") {
        res.redirect(`/post/edit/passwordRequired/${postID}`);

        return;
      }
    }
  }

  const file_ext = post.file_ext;

  const file_name = `${req.body.file_name}${file_ext}`;

  const dir = path.dirname(post.location);
  const newPath = `${dir}/${file_name}`;
  fs.rename(post.location, newPath, (err) => {
    if (err) {
      throw new Error(err);
    }
  });

  await submitEditFile(req.params.id, file_name, newPath);

  res.redirect("/");
}

export async function renderFileDeleteModal(req, res, next) {
  const post = findPostFromAllData(req.params.id, req.data);

  res.render("index", {
    allData: req.data,
    modalOpen: "deleteFile",
    values: { post },
    errors: {},
  });
}

export async function deleteFile(req, res, next) {
  await submitDeleteFile(req.params.id, req.body.file_name);

  res.redirect("/");
}

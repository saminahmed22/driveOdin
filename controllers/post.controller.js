// fileSize
import fileSize from "file-size";

// Crypto
import CryptoJS from "crypto-js";

// Models
import {
  isPostProtected,
  getPost,
  createPost,
  getFolders,
} from "../models/post.model.js";

// Utils
import { formatReadableDate } from "../utils/readableDate.utils.js";
import { generateQR } from "../utils/generateQRcode.utils.js";
import { middleEllipsis } from "../utils/stringEllipsisMiddle.js";

// Multer
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/samin-ahmed/repos/driveOdin/uploads");
  },

  filename: function (req, file, cb) {
    cb(null, file.originalname);
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
  const file_name = req.file.originalname;

  const isProtected = req.body.postPassword.length > 0;

  let location;
  if (isProtected) {
    location = CryptoJS.AES.encrypt(
      req.file.path,
      req.body.postPassword,
    ).toString();
  } else {
    location = req.file.path;
  }

  const folderId = req.body.selected_folder;

  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + parseInt(req.body.expiryDate));

  const readableExpiryDate = formatReadableDate(expires_at);
  req.body.readableExpiryDate = readableExpiryDate;

  req.file.size = fileSize(req.file.size).human("si");

  const data = {
    userId,
    file_name,
    file_size: req.file.size,
    isProtected,
    location,
    expires_at,
    folderId,
  };

  const post = await createPost(data);

  if (post instanceof Error) {
    throw new Error(post.message);
  }

  req.post = post;

  next();
}

// Download functions
export async function getImage(req, res, next) {
  const shareCode = req.params.id;

  const isProtected = await isPostProtected(shareCode);

  const givenPassword = req.session.password;
  console.log(`Session Password: ${req.session.password}`);
  /*
  Removes password stored in the session
  after accessing it the first time
  */
  removeDataFromSession(req, res);

  if (isProtected && !givenPassword) {
    console.log(`Given Password: ${givenPassword}`);

    res.redirect(`/post/passwordRequired/${shareCode}`);

    return;
  }

  const post = await getPost(shareCode, givenPassword);

  if (post instanceof Error) {
    if (post.message === "password") {
      res.redirect(`/post/passwordRequired/${shareCode}`);

      return;
    }
  }

  // Source - https://stackoverflow.com/a/10185427
  // Posted by Peter Lyons, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-07-06, License - CC BY-SA 3.0
  var fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

  const qrcode = await generateQR(fullUrl);
  post.qrcode = qrcode;

  post.file_name_short = middleEllipsis(post.file_name);

  req.post = post;

  next();
}

export async function renderUploadForm(req, res) {
  let folders;
  if (req.user) {
    folders = await getFolders(req.user.id);
  }

  res.render("index", {
    data: { folders },
    modalOpen: "uploadForm",
    errors: {},
  });
}

export async function renderDownloadForm(req, res) {
  let folders;
  if (req.user) {
    folders = await getFolders(req.user.id);
  }

  res.render("index", {
    data: { postData: req.data, folders },
    modalOpen: "downloadForm",
    errors: {},
  });
}

export async function renderDownloadPage(req, res) {
  let folders;
  if (req.user) {
    folders = await getFolders(req.user.id);
  }

  res.render("index", {
    data: { post: req.post, folders },
    modalOpen: "downloadPage",
    errors: {},
  });
}

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

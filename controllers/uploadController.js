// fileSize
import fileSize from "file-size";

// Crypto
import CryptoJS from "crypto-js";

// Prisma
import { prisma } from "../lib/prisma.js";

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

export function uploadImage(req, res, next) {
  const singleUpload = upload.single("selected_image");

  singleUpload(req, res, (err) => {
    if (err) {
      return next(err);
    }

    next();
  });
}

function formatReadableDate(isoString) {
  const date = new Date(isoString);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date).replace(/am|pm/, (m) => m.toUpperCase());
}

export async function uploadPost(req, res, next) {
  const userId = req.user.id;
  const file_name = req.file.originalname;

  const isProtected = req.body.filePasswordInput.length > 0;

  let location;
  if (isProtected) {
    location = CryptoJS.AES.encrypt(
      req.file.path,
      req.body.filePasswordInput,
    ).toString();
  } else {
    location = req.file.path;
  }

  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + parseInt(req.body.expiryDate));

  const readableExpiryDate = formatReadableDate(expires_at);
  req.body.readableExpiryDate = readableExpiryDate;

  req.file.size = fileSize(req.file.size).human("si");

  try {
    const post = await prisma.post.create({
      data: {
        userId,
        file_name,
        file_size: req.file.size,
        isProtected,
        location,
        expires_at,
      },
    });

    req.post = post;

    next();
  } catch (error) {
    next(error);
  }
}

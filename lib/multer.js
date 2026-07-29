import multer, { memoryStorage } from "multer";
import path from "path";
import Crypto from "crypto";

// Upload image in disk
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/home/samin-ahmed/repos/driveOdin/uploads");
  },

  filename: function (req, file, cb) {
    const originalFileName = file.originalname;

    const file_ext = path.extname(originalFileName);

    const file_name = `${Crypto.randomUUID()}${file_ext}`;

    cb(null, file_name);
  },
});

const upload = multer({ storage: storage });

export function uploadImageMulter(req, res, next) {
  const singleUpload = upload.single("selected_image");

  singleUpload(req, res, (err) => {
    if (err) {
      return new Error(rr);
    } else {
      next();
    }
  });
}

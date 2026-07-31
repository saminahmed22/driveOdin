import multer, { memoryStorage } from "multer";
import path from "path";
import Crypto from "crypto";

// Upload image in disk
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

export function uploadImageMulter(req, res, next) {
  const singleUpload = upload.single("selected_image");

  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

import multer from "multer";
import path from "path";

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
export function uploadImageMulter(req, res) {
  return new Promise((resolve, reject) => {
    const singleUpload = upload.single("selected_image");

    singleUpload(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

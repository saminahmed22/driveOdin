import { body } from "express-validator";
import { getAllFolders } from "../../models/folderModel.js";

export const validateUploadForm = [
  body("selected_image")
    .custom((value, { req }) => {
      const file = req?.file;

      if (!file) {
        throw new Error("Please select an file");
      } else if (file.size > 1048576) {
        throw new Error("Maximum file size 25MB");
      } else {
        return true;
      }
    })
    .bail(),

  body("file_name")
    .notEmpty()
    .withMessage("Please enter a file name.")
    .bail()
    .not()
    .matches(/[\\/:*?"<>|]/)
    .withMessage(
      "File names cannot contain these(\\, /, :, *, ?, <, >, |) symbols. You will need to select the content again :(",
    )
    .bail()
    .trim()
    .escape(),

  body("selected_folder")
    .custom(async (value, { req }) => {
      if (!value?.length) {
        throw new Error(
          "You must select a folder. If there is no folder available, please create one first.",
        );
      }

      const folders = await getAllFolders(req?.user?.id);

      const validFolders = [];

      folders.forEach((folder) => {
        validFolders.push(folder.id);
      });

      const isValid = validFolders.includes(value);

      if (!isValid) {
        throw new Error("Please pick a valid folder.");
      }
    })
    .bail(),

  body("expiryDate")
    .isIn(["1", "3", "7", "15"])
    .withMessage("Expiry date must be within 1-15 days.")
    .bail(),
];

export const validateEditForm = [
  body("file_name")
    .notEmpty()
    .withMessage("Please enter a file name.")
    .bail()
    .not()
    .matches(/[\\/:*?"<>|]/)
    .withMessage(
      "File names cannot contain these(\\, /, :, *, ?, <, >, |) symbols.",
    )
    .bail()
    .trim()
    .escape(),
];

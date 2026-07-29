import { body } from "express-validator";

export const validateCreateFolderForm = [
  body("folder_name")
    .notEmpty()
    .withMessage("Please enter a folder name.")
    .bail()
    .not()
    .matches(/[\\/:*?"<>|]/)
    .withMessage(
      "Folder names cannot contain these(\\, /, :, *, ?, <, >, |) symbols.",
    )
    .bail()
    .trim()
    .escape(),
];

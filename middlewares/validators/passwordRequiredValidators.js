import { body } from "express-validator";
import { findPost } from "../../models/postModel.js";
import { findFolder } from "../../models/folderModel.js";
import { compareHash } from "../../utils/crypto.js";

export const validatePasswordRequiredForm = [
  body("password")
    .notEmpty()
    .withMessage("Password field cannot be empty")
    .bail()
    .custom(async (value, { req }) => {
      const contentID = req?.params?.id;

      const requestType = req.originalUrl.split("/").includes("post")
        ? "post"
        : "folder";

      let content =
        requestType === "post"
          ? await findPost(contentID)
          : await findFolder(contentID);

      if (!content) {
        return true;
      }

      const isContentProtected = content.isProtected;

      if (!isContentProtected) {
        return true;
      }

      const contentHash = content.passwordHash;

      const isGenuine = await compareHash(value, contentHash);

      if (!isGenuine) {
        throw new Error("Wrong password, please try again.");
      } else {
        return true;
      }
    }),
];

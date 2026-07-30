import { body } from "express-validator";
import { findPost } from "../../models/postModel.js";
import { findFolder } from "../../models/folderModel.js";
import { compareHash } from "../../utils/crypto.js";

export const validateDownloadForm = [
  body("shareCode")
    .custom((value, { req }) => {
      if (value || (!value && req.params.id)) {
        return true;
      } else if (!value && !req.params.id) {
        throw new Error(`Please enter a share code.`);
      }
    })

    .bail()
    .custom(async (value, { req }) => {
      const requestType = req.originalUrl.split("/").includes("post")
        ? "post"
        : "folder";

      const contentID = req?.body?.shareCode || req?.params?.id;

      if (requestType === "post") {
        const post = await findPost(contentID);

        if (!post) {
          throw new Error(`Cannot find any post with the ID: ${contentID}`);
        }
      } else if (requestType === "folder") {
        const folder = await findFolder(contentID);

        if (!folder) {
          throw new Error(`Cannot find any folder with the ID: ${contentID}`);
        }
      }
    })
    .bail()
    .trim()
    .escape(),

  body("password").custom(async (value, { req }) => {
    const contentID = req?.body?.shareCode || req?.params?.id;

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

    if (value?.length <= 0) {
      throw new Error(
        `This ${requestType} is password protected. Please enter the password.`,
      );
    } else {
      const contentHash = content.passwordHash;

      const isGenuine = await compareHash(value, contentHash);

      if (!isGenuine) {
        throw new Error("Wrong password, please try again.");
      } else {
        return true;
      }
    }
  }),
];

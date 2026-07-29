import { body } from "express-validator";
import { findPost } from "../../models/postModel.js";
import { findFolder } from "../../models/folderModel.js";

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
];

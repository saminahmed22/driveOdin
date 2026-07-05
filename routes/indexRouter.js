import Router from "express";

// Controllers
import {
  renderIndex,
  renderSharePage,
  renderDownloadPage,
} from "../controllers/indexController.js";
import { uploadImage, uploadPost } from "../controllers/uploadController.js";
import { getImage } from "../controllers/downloadController.js";

// Middlewares
import { authenticationStatus } from "../middlewares/authenticationStatus.js";

// Express Router initialization
export const indexRouter = Router();

// Routes

//____get
indexRouter.get("/", authenticationStatus, renderIndex);

//____post
indexRouter.post(
  "/upload",
  authenticationStatus,
  uploadImage,
  uploadPost,
  renderSharePage,
);

indexRouter.post(
  "/download",
  authenticationStatus,
  getImage,
  renderDownloadPage,
);

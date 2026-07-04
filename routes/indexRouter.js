import Router from "express";

// Controllers
import { renderIndex } from "../controllers/indexController.js";
import {
  renderSharePage,
  uploadImage,
  uploadPost,
} from "../controllers/uploadController.js";

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

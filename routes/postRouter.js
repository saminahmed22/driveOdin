import Router from "express";

export const postRouter = Router();

// Controllers
import {
  uploadImage,
  uploadPost,
  getImage,
  renderDownloadForm,
  renderDownloadPage,
  addDataToSession,
} from "../controllers/postController.js";

// Models
import { authenticationStatus, isAuthor } from "../models/authModel.js";

// Middlewares
import { fetchAlluserData } from "../middlewares/fetchAlluserData.js";

function redirectToPostView(req, res, next) {
  const id = req?.post?.id || req?.body?.shareCode;

  res.redirect(`/post/${id}`);
}

// Routes

//____get
postRouter.get("/:id", fetchAlluserData, getImage, renderDownloadPage);

postRouter.get("/passwordRequired/:id", fetchAlluserData, (req, res) => {
  renderDownloadForm(req, res, "password");
});

//____post
postRouter.post(
  "/upload",
  authenticationStatus,
  uploadImage,
  uploadPost,
  addDataToSession,
  redirectToPostView,
); // upload image is a multer function
postRouter.post("/edit", isAuthor);
postRouter.post("/download", addDataToSession, redirectToPostView);

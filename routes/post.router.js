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
} from "../controllers/post.controller.js";

// Middlewares
import {
  authenticationStatus,
  isAuthor,
} from "../middlewares/authenticationStatus.js";

function redirectToPostView(req, res, next) {
  const id = req?.post?.id || req?.body?.shareCode;

  res.redirect(`/post/${id}`);
}

// Routes

//____get
postRouter.get("/:id", getImage, renderDownloadPage);

postRouter.get(
  "/passwordRequired/:id/",
  (req, res, next) => {
    req.data = {
      passwordRequired: true,
      shareCode: req.params.id,
      error: "password",
    };

    next();
  },
  renderDownloadForm,
);

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

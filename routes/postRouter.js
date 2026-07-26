import Router from "express";

export const postRouter = Router();

// Controllers
import {
  handleCreatePostRequest,
  getImage,
  renderDownloadForm,
  renderDownloadPage,
  renderFileEditModal,
  handleEditPostRequest,
  renderFileDeleteModal,
  handleDeletePostRequest,
  addDataToSession,
  renderPasswordRequriedForm,
} from "../controllers/postController.js";

// Models
import { authenticationStatus, isAuthor } from "../models/authModel.js";

// Middlewares
import { fetchAlluserData } from "../middlewares/fetchAlluserData.js";

function redirectToPostView(req, res, next) {
  const id = req?.post?.id || req?.body?.shareCode || req.params.id;

  res.redirect(`/post/${id}`);
}

// Routes

//____get
postRouter.get(
  "/:id",
  isAuthor,
  fetchAlluserData,
  getImage,
  renderDownloadPage,
);

postRouter.get(
  "/passwordRequired/:id",
  fetchAlluserData,
  renderPasswordRequriedForm,
);

postRouter.get(
  "/edit/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  renderFileEditModal,
);

postRouter.get(
  "/delete/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  renderFileDeleteModal,
);

//____post
postRouter.post("/passwordRequired/:id", addDataToSession, redirectToPostView);

postRouter.post(
  "/upload",
  authenticationStatus,
  handleCreatePostRequest,
  redirectToPostView,
);

postRouter.post(
  "/edit/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  handleEditPostRequest,
);

postRouter.post(
  "/delete/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  handleDeletePostRequest,
);

postRouter.post("/download", addDataToSession, redirectToPostView);

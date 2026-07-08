import Router from "express";

export const folderRouter = Router();

// Controllers
import {
  createFolder,
  renderFolderPage,
  findFolder,
  editFolder,
  deleteFolder,
} from "../controllers/folder.controller.js";

// Middlewares
import {
  authenticationStatus,
  isAuthor,
} from "../middlewares/authenticationStatus.js";

function redirectToFolderView(req, res, next) {
  const id = req.params.id;

  res.redirect(`/folder/${id}`);
}

// Routes

//____get
folderRouter.get("/:id", findFolder, renderFolderPage);

//____post
folderRouter.post("/new", authenticationStatus, createFolder);
folderRouter.post(
  "/edit/:id",
  authenticationStatus,
  isAuthor,
  editFolder,
  redirectToFolderView,
);
folderRouter.post("/delete/:id", authenticationStatus, isAuthor, deleteFolder);

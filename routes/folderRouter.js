import Router from "express";

export const folderRouter = Router();

// Controllers
import {
  createFolder,
  renderFolderPage,
  editFolder,
  deleteFolder,
} from "../controllers/folderController.js";

// Models
import { authenticationStatus, isAuthor } from "../models/authModel.js";

import { fetchAlluserData } from "../middlewares/fetchAlluserData.js";

function redirectToFolderView(req, res, next) {
  const id = req.params.id;

  res.redirect(`/folder/${id}`);
}

// Routes

//____get
folderRouter.get("/:id", fetchAlluserData, renderFolderPage);

//____post
folderRouter.post("/new", authenticationStatus, createFolder);
folderRouter.post(
  "/edit/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  editFolder,
  redirectToFolderView,
);
folderRouter.post(
  "/delete/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  deleteFolder,
);

import Router from "express";

export const folderRouter = Router();

// Controllers
import {
  handleCreateFolderRequest,
  handleEditFolderRequest,
  handleDeleteFolderRequest,
  renderFolderEditPopver,
  renderFolderDeletePopver,
  renderFolderPage,
  getFolder,
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
folderRouter.get("/:id", fetchAlluserData, getFolder, renderFolderPage);

folderRouter.get(
  "/edit/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  renderFolderEditPopver,
);

folderRouter.get(
  "/delete/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  renderFolderDeletePopver,
);

//____post
folderRouter.post("/new", authenticationStatus, handleCreateFolderRequest);

folderRouter.post(
  "/edit/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  handleEditFolderRequest,
);
folderRouter.post(
  "/delete/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  handleDeleteFolderRequest,
);

import Router from "express";

export const folderRouter = Router();

// Controllers
import {
  handleCreateFolderRequest,
  handleEditFolderRequest,
  handleDeleteFolderRequest,
  renderFolderCreatePopver,
  renderFolderEditPopver,
  renderFolderDeletePopver,
  renderFolderPage,
  getFolder,
  handleFolderDownloadRequest,
} from "../controllers/folderController.js";

import {
  addDataToSession,
  renderPasswordRequriedForm,
} from "../controllers/postController.js";

import { renderDownloadForm } from "../controllers/postController.js";

// Models
import { authenticationStatus, isAuthor } from "../models/authModel.js";

import { fetchAlluserData } from "../middlewares/fetchAlluserData.js";

// Validators
import { validationResult } from "express-validator";
import { validateCreateFolderForm } from "../middlewares/validators/folderValidators.js";
import { validateDownloadForm } from "../middlewares/validators/downloadValidator.js";
import { validatePasswordRequiredForm } from "../middlewares/validators/passwordRequiredValidators.js";

function redirectToFolderView(req, res, next) {
  const id = req.params.id || req?.body?.shareCode;

  res.redirect(`/folder/${id}`);
}

// Routes

//____get
folderRouter.get(
  "/:id",
  isAuthor,
  fetchAlluserData,
  getFolder,
  renderFolderPage,
);

folderRouter.get(
  "/passwordRequired/:id",
  fetchAlluserData,
  renderPasswordRequriedForm,
);

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

folderRouter.get("/download/:id", handleFolderDownloadRequest);

//____post
folderRouter.post(
  "/passwordRequired/:id",
  validatePasswordRequiredForm,
  (req, res, next) => {
    const formValidationErrors = validationResult(req);

    if (!formValidationErrors.isEmpty()) {
      return renderPasswordRequriedForm(req, res);
    }

    next();
  },
  addDataToSession,
  redirectToFolderView,
);

folderRouter.post(
  "/new",
  authenticationStatus,
  fetchAlluserData,
  validateCreateFolderForm,
  (req, res, next) => {
    const formValidationErrors = validationResult(req);

    if (!formValidationErrors.isEmpty()) {
      return renderFolderCreatePopver(req, res);
    }

    next();
  },
  handleCreateFolderRequest,
);

folderRouter.post(
  "/edit/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  validateCreateFolderForm,
  (req, res, next) => {
    const formValidationErrors = validationResult(req);

    if (!formValidationErrors.isEmpty()) {
      return renderFolderEditPopver(req, res);
    }

    next();
  },
  handleEditFolderRequest,
);
folderRouter.post(
  "/delete/:id",
  authenticationStatus,
  isAuthor,
  fetchAlluserData,
  handleDeleteFolderRequest,
);

folderRouter.post(
  "/download",
  fetchAlluserData,
  validateDownloadForm,
  (req, res, next) => {
    const formValidationErrors = validationResult(req);

    if (!formValidationErrors.isEmpty()) {
      return renderDownloadForm(req, res);
    }

    next();
  },
  addDataToSession,
  redirectToFolderView,
);

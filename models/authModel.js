// Models
import { findPostAuthor } from "../models/postModel.js";
import { findFolderAuthor } from "../models/folderModel.js";

// Checks authentication status on every route needed
export function authenticationStatus(req, res, next) {
  const status = req?.isAuthenticated();

  status ? next() : res.redirect("/auth/login");
}

// Checks if one account is already logged in or not
export function authenticationStatusOnReAuth(req, res, next) {
  const status = req.isAuthenticated();

  status ? res.redirect("/") : next();
}

// Logs in the user after registration
export function forceLogin(req, res, next) {
  req.login(req.user, (error) => {
    error ? next(error) : res.redirect("/");
  });
}

export function forceLogout(req, res, next) {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    req.logout(req.user, (error) => {
      error ? next(error) : res.redirect("/auth/login");
    });
  }
}

export async function isAuthor(req, res, next) {
  const requester = req.user?.id;

  if (!requester) {
    res.redirect("/auth/login");
  }

  const urlArr = req.originalUrl.split("/");

  const requestID = req.params.id;

  const authorID = urlArr.includes("post")
    ? await findPostAuthor(requestID)
    : await findFolderAuthor(requestID);

  requester === authorID ? next() : res.send("Denied");
}

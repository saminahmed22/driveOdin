// Models
import { registerUserDB } from "../models/userModel.js";

// Utils
import { hashString } from "../utils/crypto.js";

import { validationResult } from "express-validator";

export async function renderLoginPage(req, res) {
  const passportErrors = req?.flash("error");
  const formValidationErrors = validationResult(req);

  let usernameValidationError, passwordValidationError;
  formValidationErrors.errors.forEach((error) => {
    if (error.path === "username") {
      usernameValidationError = error.msg;
    } else if (error.path === "password") {
      passwordValidationError = error.msg;
    }
  });

  const hasErrors =
    passportErrors.length > 0 || !formValidationErrors.isEmpty();

  res.status(hasErrors ? 400 : 200).render("authPage", {
    authMode: "login",
    values: { username: req?.body?.username },
    errorMessages: {
      passportErrors,
      validationErrors: {
        username: usernameValidationError,
        password: passwordValidationError,
      },
    },
  });
}

export async function renderRegistrationPage(req, res) {
  const formValidationErrors = validationResult(req);

  console.log(formValidationErrors);

  let firstNameValidationError,
    lastNameValidationError,
    usernameValidationError,
    passwordValidationError,
    rePasswordValidationError;
  formValidationErrors.errors.forEach((error) => {});

  for (const error of formValidationErrors.errors) {
    if (error.path === "first_name") {
      firstNameValidationError = error.msg;
    } else if (error.path === "last_name") {
      lastNameValidationError = error.msg;
    } else if (error.path === "username") {
      usernameValidationError = error.msg;
    } else if (error.path === "password") {
      passwordValidationError = error.msg;
    } else if (error.path === "rePassword") {
      rePasswordValidationError = error.msg;
    }
  }

  console.log({
    firstName: firstNameValidationError,
    lastName: lastNameValidationError,
    username: usernameValidationError,
    password: passwordValidationError,
    rePassword: rePasswordValidationError,
  });

  res.render("authPage", {
    authMode: "register",
    values: {
      firstName: req?.body?.first_name,
      lastName: req?.body?.last_name,
      username: req?.body?.username,
      password: req?.body?.password,
      rePassword: req?.body?.rePassword,
    },
    errorMessages: {
      passportError: [],
      validationErrors: {
        firstName: firstNameValidationError,
        lastName: lastNameValidationError,
        username: usernameValidationError,
        password: passwordValidationError,
        rePassword: rePasswordValidationError,
      },
    },
  });
}

export async function registerUser(req, res, next) {
  const userSubmittedData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password_hash: await hashString(req.body.password),
  };

  const user = await registerUserDB(userSubmittedData);

  req.user = user;

  next();
}

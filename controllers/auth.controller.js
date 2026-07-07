// Models
import { registerUserDB } from "../models/user.model.js";

// Utils
import { hashPassword } from "../utils/password.utils.js";

export async function renderLoginPage(req, res) {
  const passportErrors = req?.flash("error");
  // const formValidationErrors = validationResult(req);

  const hasErrors = passportErrors.length > 0; // || !formValidationErrors.isEmpty();

  res.status(hasErrors ? 400 : 200).render("authPage", {
    authMode: "login",
    errorMessages: { passportErrors, validationError: [] },
  });
}

export async function renderRegistrationPage(req, res) {
  res.render("authPage", {
    authMode: "register",
    errorMessages: { passportError: [], validationError: [] },
  });
}

export async function registerUser(req, res, next) {
  const userSubmittedData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password_hash: await hashPassword(req.body.password),
  };

  const user = await registerUserDB(userSubmittedData);

  req.user = user;

  next();
}

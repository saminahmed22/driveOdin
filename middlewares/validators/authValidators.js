import { body } from "express-validator";
import { findUser } from "../../models/userModel.js";

export const validateLoginForm = [
  body("username")
    .notEmpty()
    .withMessage("Please enter a username.")
    .bail()
    .trim()
    .escape(),

  body("password").notEmpty().withMessage("Please enter the password.").bail(),
];

export const validateRegisterForm = [
  body("first_name")
    .notEmpty()
    .withMessage("Please enter your first name.")
    .bail()
    .isAlpha()
    .withMessage("Name can only contain letters.")
    .bail()
    .trim()
    .escape(),

  body("last_name")
    .notEmpty()
    .withMessage("Please enter your last name.")
    .bail()
    .isAlpha()
    .withMessage("Name can only contain letters.")
    .bail()
    .trim()
    .escape(),

  body("username")
    .notEmpty()
    .withMessage("Please enter a username.")
    .bail()
    .custom(async (value) => {
      const exists = !!(await findUser({ username: value }));
      if (exists) {
        throw new Error(
          "This username already exists, try out a different one please.",
        );
      }
      return true;
    })
    .bail()
    .trim()
    .escape(),

  body("password")
    .notEmpty()
    .withMessage("Please enter a strong password.")
    .bail()
    .isStrongPassword({
      minUppercase: 1,
      minLowercase: 1,
      minSymbols: 1,
      minLength: 6,
    })
    .withMessage(
      "Password must be at least 6 characters long using a mix of both uppercase and lowercase letters, numbers, and symbols.",
    ),

  body("rePassword").custom((value, { req }) => {
    if (req.body.password?.length < 1) {
      return true;
    } else if (req.body.password.length > 0 && value.length < 1) {
      throw new Error("Please re-enter the password.");
    } else if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),
];

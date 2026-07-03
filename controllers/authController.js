export async function renderLoginPage(req, res) {
  const passportErrors = req?.flash("error");
  // const formValidationErrors = validationResult(req);
  console.log(passportErrors);

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

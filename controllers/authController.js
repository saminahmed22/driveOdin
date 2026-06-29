export async function renderLoginPage(req, res) {
  res.render("authPage", { authMode: "login" });
}

export async function renderRegistrationPage(req, res) {
  res.render("authPage", { authMode: "register" });
}

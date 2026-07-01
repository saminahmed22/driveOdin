export function authenticationStatus(req, res, next) {
  const status = req.isAuthenticated();

  if (status) {
    return next();
  } else {
    return res.redirect("/auth/login");
  }
}

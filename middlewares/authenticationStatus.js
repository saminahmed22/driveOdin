// Checks authentication status on every route needed
export function authenticationStatus(req, res, next) {
  const status = req.isAuthenticated();

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
  req.logout(req.user, (error) => {
    error ? next(error) : res.redirect("/auth/login");
  });
}

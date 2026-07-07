export function renderIndex(req, res) {
  res.render("index", {
    data: {},
    modalOpen: null,
    errors: {},
  });
}

export async function renderIndex(req, res) {
  res.render("index", {
    allData: req.data,
    modalOpen: null,
    values: {},
    errors: {},
  });
}

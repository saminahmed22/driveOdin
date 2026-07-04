export async function renderIndex(req, res) {
  res.render("index", {
    uploadData: null,
    uploadModalOpen: false,
    modalContent: null,
  });
}

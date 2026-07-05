export function renderIndex(req, res) {
  res.render("index", {
    uploadData: null,
    modalOpen: false,
    modalContent: null,
  });
}

export function renderSharePage(req, res) {
  res.render("index", {
    data: req,
    modalOpen: "upload",
    modalContent: "sharePage",
  });
}

export function renderDownloadPage(req, res) {
  res.render("index", {
    data: req.post,
    modalOpen: "download",
    modalContent: "downloadPage",
  });
}

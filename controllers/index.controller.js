// Modles
import { getFolders } from "../models/folder.model.js";

export async function renderIndex(req, res) {
  let folders;
  if (req.user) {
    folders = await getFolders(req.user.id);
  }

  res.render("index", {
    data: { folders },
    modalOpen: null,
    errors: {},
  });
}

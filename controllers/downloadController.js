// Modles
import { isPostProtected, getPost } from "../models/post.model.js";

export async function getImage(req, res, next) {
  const shareCode = req.body.shareCode;
  const password =
    req.body.filePasswordInput.length > 0 ? req.body.filePasswordInput : false;

  const isProtected = await isPostProtected(shareCode);
  if (isProtected && !password) {
    throw new Error("Post is protected, but no password has been provided.");
  }

  const post = await getPost(shareCode, password);

  req.post = post;

  next();
}

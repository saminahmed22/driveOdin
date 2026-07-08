// Prisma
import { prisma } from "../lib/prisma.js";

// Crypto
import CryptoJS from "crypto-js";

// Utils
import { formatReadableDate } from "../utils/readableDate.utils.js";
import { generateQR } from "../utils/generateQRcode.utils.js";
import { middleEllipsis } from "../utils/stringEllipsisMiddle.js";

export async function getPost(postId, password = false) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  const isProtected = post.isProtected;

  if (isProtected && !password) {
    return new Error("password");
  }

  if (isProtected) {
    const decryptedLocation = CryptoJS.AES.decrypt(
      post.location,
      password,
    ).toString();

    if (!decryptedLocation) {
      throw new Error("Wrong password, try again.");
    }

    post.location = decryptedLocation;
  }

  post.uploaded_at = formatReadableDate(post.uploaded_at);
  post.expires_at = formatReadableDate(post.expires_at);

  return post;
}

export async function isPostProtected(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { isProtected: true },
  });

  const status = post.isProtected;

  return status;
}

export async function createPost(data) {
  try {
    const post = await prisma.post.create({ data });

    return post;
  } catch (error) {
    return new Error(error);
  }
}

export async function editPost(id, data) {
  try {
    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: { data },
    });

    return post;
  } catch (error) {
    throw error;
  }
}

export async function deletePost(id) {
  try {
    const post = await prisma.post.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function findPostAuthor(id) {
  try {
    const authorID = await prisma.post.findUnique({
      where: { id },
      select: {
        user: {
          select: {
            id,
          },
        },
      },
    });

    return authorID;
  } catch (error) {
    throw error;
  }
}

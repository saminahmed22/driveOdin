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

// Folder related functions
export async function createFolderDB(data) {
  try {
    const folder = await prisma.folder.create({ data });

    return folder;
  } catch (error) {
    throw error;
  }
}

export async function getFolders(userId) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: userId },
      include: {
        posts: true,
      },
    });

    folders.forEach((folder) => {
      folder.posts.forEach((post) => {
        post.file_name = middleEllipsis(post.file_name);
        post.uploaded_at = formatReadableDate(post.uploaded_at);
        post.expires_at = formatReadableDate(post.expires_at);
      });
    });

    return folders;
  } catch (error) {
    throw error;
  }
}

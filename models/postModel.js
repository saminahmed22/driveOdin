// Prisma
import { prisma } from "../lib/prisma.js";

// Utils
import { formatReadableDate } from "../utils/readableDate.js";
import { generateQR } from "../utils/generateQRcode.js";
import { middleEllipsis } from "../utils/stringEllipsisMiddle.js";
import { decryptString } from "../utils/crypto.js";

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

export async function getPost(id) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    return post;
  } catch (error) {
    return new Error(error);
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

export async function decryptPost(post, password) {
  if (!post) {
    throw new Error("No post has been provided to decrypt.");
  }

  if (!password) {
    throw new Error(
      `No password has been provided to decrypt the post.\nPost ID: ${post.id}`,
    );
  }

  const decryptedLocation = decryptString(post.location, password);

  if (!decryptedLocation) {
    return new Error("Wrong password, try again.");
  }

  post.location = decryptedLocation;
}

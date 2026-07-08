// Prisma
import { prisma } from "../lib/prisma.js";

// Utils
import { formatReadableDate } from "../utils/readableDate.utils.js";
import { generateQR } from "../utils/generateQRcode.utils.js";
import { middleEllipsis } from "../utils/stringEllipsisMiddle.js";

export async function submitCreateFolder(data) {
  try {
    const folder = await prisma.folder.create({ data });

    return folder;
  } catch (error) {
    throw error;
  }
}

export async function getFolder(id) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (folder) {
      folder.posts.forEach((post) => {
        post.file_name = middleEllipsis(post.file_name);
        post.uploaded_at = formatReadableDate(post.uploaded_at);
        post.expires_at = formatReadableDate(post.expires_at);
      });

      return folder;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

export async function getFolders(userId) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId },
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

export async function submitEditFolder(id, data) {
  try {
    const folder = await prisma.folder.update({
      where: {
        id: id,
      },
      data: { data },
    });

    return folder;
  } catch (error) {
    throw error;
  }
}

export async function submitDeleteFolder(id) {
  try {
    await prisma.folder.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function findFolderAuthor(id) {
  try {
    const authorID = await prisma.folder.findUnique({
      where: { id },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return authorID?.user?.id;
  } catch (error) {
    throw error;
  }
}

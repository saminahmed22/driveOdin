// Prisma
import { prisma } from "../lib/prisma.js";

// Utils
import { reformatPostDataObject } from "../utils/reformatAllDataObject.js";

export async function createFolder(data) {
  try {
    const folder = await prisma.folder.create({ data });

    return folder;
  } catch (error) {
    throw error;
  }
}

export async function editFolder(folderID, userID, data) {
  if (!folderID) {
    throw new Error("Folder ID has not been provided");
  }

  if (!userID) {
    throw new Error("User ID has not been provided");
  }

  if (!data) {
    throw new Error("File name has not been provided");
  }

  try {
    const folder = await prisma.folder.update({
      where: { id: folderID, userId: userID },
      data: { folder_name: data.folder_name },
    });

    return folder;
  } catch (error) {
    throw error;
  }
}

export async function deleteFolder(folderID, userID) {
  if (!folderID) {
    throw new Error("Folder ID has not been provided");
  }

  if (!userID) {
    throw new Error("User ID has not been provided");
  }

  try {
    await prisma.folder.delete({
      where: {
        id: folderID,
        userId: userID,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function findFolder(id) {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });

    if (folder) {
      folder.posts.forEach((post) => {
        reformatPostDataObject(post);
      });

      return folder;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

export async function getAllFolders(userId) {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId },
      include: {
        posts: {
          orderBy: { uploaded_at: true },
        },
      },
      orderBy: { created_at: true },
    });

    folders.forEach((folder) => {
      folder.posts.forEach((post) => {
        reformatPostDataObject(post);
      });
    });

    return folders;
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

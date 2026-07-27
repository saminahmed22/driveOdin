import { prisma } from "../lib/prisma.js";

export async function createPost(data) {
  try {
    const post = await prisma.post.create({ data });

    return post;
  } catch (error) {
    return new Error(error);
  }
}

export async function editPost(postID, userID, data) {
  if (!postID) {
    throw new Error("Post ID has not been provided");
  }

  if (!userID) {
    throw new Error("User ID has not been provided");
  }

  if (!data) {
    throw new Error("No data has not been provided");
  }

  try {
    const post = await prisma.post.update({
      where: { id: postID, userId: userID },
      data: { file_name: data.file_name, location: data.newPath },
    });

    return post;
  } catch (error) {
    throw error;
  }
}

export async function deletePost(postID, userID) {
  if (!postID) {
    throw new Error("Post ID has not been provided");
  }

  if (!userID) {
    throw new Error("User ID has not been provided");
  }

  try {
    await prisma.post.delete({
      where: {
        id: postID,
        userId: userID,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function findPost(id) {
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

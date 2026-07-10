import { prisma } from "../lib/prisma.js";

export async function registerUserDB(userSubmittedData) {
  const user = await prisma.user.create({
    data: userSubmittedData,
  });

  if (!user) {
    throw new Error("There was a problem creating user.");
  }

  return user;
}

export async function findUser({ id, username }) {
  if (!id && !username) {
    throw new Error("No ID or username has been provided.");
  }

  const user = await prisma.user.findUnique(
    id ? { where: { id } } : { where: { username } },
  );

  if (!user) {
    throw new Error(
      `No user has been found with the ID/Username: ${id || username}.`,
    );
  }

  return user;
}

export async function getAllUserData(userId) {
  if (!userId) {
    throw new Error("No ID has been provided.");
  }

  const allData = await prisma.user.findUnique({
    where: { id: userId },
    include: { folders: { include: { posts: true } } },
  });

  if (!allData) {
    throw new Error("No data has been found.");
  } else {
    return allData;
  }
}

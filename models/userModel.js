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
  const user = await prisma.user.findUnique(
    id ? { where: { id } } : { where: { username } },
  );

  return user;
}

export async function getAllUserData(userId) {
  if (!userId) {
    throw new Error("No ID has been provided.");
  }

  const allData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      folders: {
        include: { posts: { orderBy: { uploaded_at: "asc" } } },
        orderBy: { created_at: "asc" },
      },
    },
  });

  if (!allData) {
    throw new Error("No data has been found.");
  } else {
    return allData;
  }
}

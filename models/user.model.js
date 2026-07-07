import { prisma } from "../lib/prisma.js";

export async function registerUserDB(userSubmittedData) {
  try {
    const user = await prisma.user.create({
      data: userSubmittedData,
    });

    return user;
  } catch (error) {
    throw new Error(error);
  }
}

export async function findUser({ id, username }) {
  if (!id && !username) {
    throw new Error("No ID or username has been provided.");
  }

  try {
    const user = await prisma.user.findFirst(
      id ? { where: { id } } : { where: { username } },
    );

    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

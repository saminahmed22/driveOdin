import { prisma } from "../lib/prisma.js";
import { hashPassword } from "../utils/passwordUtils.js";

export async function registerUser(req, res) {
  const userSubmittedData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password_hash: await hashPassword(req.body.password),
  };

  try {
    const user = await prisma.user.create({
      data: userSubmittedData,
    });

    res.redirect("/");
  } catch (error) {
    console.error(error);
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

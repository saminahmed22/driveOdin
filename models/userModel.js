import { prisma } from "../lib/prisma.js";

export async function registerUser(req, res) {
  const userSubmittedData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password_hash: req.body.password,
  };
  try {
    const user = await prisma.user.create({
      data: userSubmittedData,
    });
    console.log("Created user:", user);
    await prisma.$disconnect();

    res.redirect("/");
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

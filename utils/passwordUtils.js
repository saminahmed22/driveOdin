import bcrypt from "bcrypt";

export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return hashedPassword;
}

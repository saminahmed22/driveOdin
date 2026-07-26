// Hash
import bcrypt from "bcrypt";

export async function hashString(string) {
  if (!string) {
    throw new Error("No string has been provided to hash.");
  }

  const hashedString = await bcrypt.hash(string, 10);

  return hashedString;
}

export async function compareHash(string, hash) {
  if (!string || !hash) {
    throw new Error(
      `No ${!string ? "string" : "hash"} has been provided to compare.`,
    );
  }

  const isCorrectString = await bcrypt.compare(string, hash);

  return isCorrectString;
}

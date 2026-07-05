// Prisma
import { prisma } from "../lib/prisma.js";

// Crypto
import CryptoJS from "crypto-js";

function formatReadableDate(isoString) {
  const date = new Date(isoString);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(date).replace(/am|pm/, (m) => m.toUpperCase());
}

export async function getPost(postId, password = false) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  const isProtected = post.isProtected;

  if (isProtected) {
    const decryptedLocation = CryptoJS.AES.decrypt(
      post.location,
      password,
    ).toString();

    if (!decryptedLocation) {
      throw new Error("Wrong password, try again.");
    }

    post.location = decryptedLocation;
  }

  post.expires_at = formatReadableDate(post.expires_at);

  console.log(post);

  return post;
}

export async function isPostProtected(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { isProtected: true },
  });

  const status = post.isProtected;

  return status;
}

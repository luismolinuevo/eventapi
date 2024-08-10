import prisma from "../config/prismaClient.js";

async function isTokenBlacklisted(token, type = "refresh") {
  const blacklistedToken = await prisma.token.findFirst({
    where: { token, type },
  });
  return !!blacklistedToken;
}

async function saveToken(userId, token, type, expiration) {
  await prisma.token.create({
    data: {
      userId,
      token,
      type,
      expiry: new Date(Date.now() + expiration),
    },
  });
}

async function invalidateToken(token) {
  await prisma.token.update({
    where: { token },
    data: { token: null }, // nullify token
  });
}

export { isTokenBlacklisted, saveToken, invalidateToken };

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const PORT = process.env.PORT;

export const ACCESS_TOKEN_NAME = process.env.ACCESS_TOKEN_NAME;
export const REFRESH_TOKEN_NAME = process.env.REFRESH_TOKEN_NAME;
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESSS_EXPIRATION;
export const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION;

export const DEV_EMAIL_HOST = process.env.DEV_EMAIL_HOST;
export const DEV_EMAIL_PORT = process.env.DEV_EMAIL_PORT;
export const DEV_EMAIL_USER = process.env.DEV_EMAIL_USER;
export const DEV_EMAIL_PASS = process.env.DEV_EMAIL_PASS;
export const DEV_EMAIL_CIPHERS = process.env.DEV_EMAIL_CIPHERS;
export const DEV_FROM_EMAIL = process.env.DEV_FROM_EMAIL;
export const DEV_FROM_EMAIL_NAME = process.env.DEV_FROM_EMAIL_NAME;


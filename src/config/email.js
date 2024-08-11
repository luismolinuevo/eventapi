import nodemailer from "nodemailer";
import {
  DEV_EMAIL_HOST,
  DEV_EMAIL_PORT,
  DEV_EMAIL_USER,
  DEV_EMAIL_PASS,
} from "../secrets";

const transporter = nodemailer.createTransport({
  host: DEV_EMAIL_HOST,
  port: DEV_EMAIL_PORT,
  auth: {
    user: DEV_EMAIL_USER,
    pass: DEV_EMAIL_PASS,
  },
});

export { transporter };

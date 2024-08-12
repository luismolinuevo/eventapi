import { transporter } from "../../config/email.js";
import { EmailError } from "../../utils/exceptions.js";

async function sendResetPasswordEmail(email, token) {
  try {
    const mailOptions = {
      from: "your-email@example.com",
      to: email,
      subject: "Password Reset",
      text: `Here is your password reset token: ${token}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new EmailError("Error sending reset password email");
  }
}

export { sendResetPasswordEmail };

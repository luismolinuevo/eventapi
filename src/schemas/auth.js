import Ajv from "ajv";

const ajv = new Ajv();

const authSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

const forgetPasswordSchema = {
  type: "object",
  properties: {
    emailOrPhone: {
      type: "string",
      oneOf: [
        {
          format: "email",
        },
        {
          pattern: "^\\+?[1-9]\\d{1,14}$",
        },
      ],
    },
  },
  required: ["emailOrPhone"],
  additionalProperties: false,
};

const resetPasswordSchema = {
  type: "object",
  properties: {
    token: {
      type: "string",
      minLength: 1,
    },
    newPassword: {
      type: "string",
      minLength: 8,
    },
  },
  required: ["token", "newPassword"],
  additionalProperties: false,
};

export const validateAuthData = ajv.compile(authSchema);
export const validateForgetPasswordData = ajv.compile(forgetPasswordSchema);
export const validateResetPasswordSchema = ajv.compile(resetPasswordSchema);

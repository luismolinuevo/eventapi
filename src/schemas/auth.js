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

export const validateAuthData = ajv.compile(authSchema);

import Ajv from "ajv";

const ajv = new Ajv();

const signUpSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
  },
  required: ["email", "password"],
  additionalProperties: false,
};

export const validateSignUp = ajv.compile(signUpSchema);

import request from "supertest";
import createServer from "../../src/server.js";
import { closeServer } from "../../src/testServer.js";

// Mocking the dependencies
jest.mock("../../src/services/auth.js", () => ({
  loginService: jest.fn(),
}));

import { loginService } from "../../src/services/auth.js";

describe("Auth Controller", () => {
  let app;

  beforeAll(async () => {
    app = await createServer();
  });

  afterAll(async () => {
    await closeServer();
  });

  describe("POST /api/auth/login", () => {
    it("should return 200 and set cookies when credentials are valid", async () => {
      // Mocking successful loginService response
      loginService.mockResolvedValue({
        access_token: "fakeAccessToken",
        refresh_token: "fakeRefreshToken",
      });

      const response = await request(app).post("/api/auth/login").send({
        email: "test1@gmail.com",
        password: "test1111",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User login success");
      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringContaining("accessToken=fakeAccessToken"),
          expect.stringContaining("refreshToken=fakeRefreshToken"),
        ])
      );
    });

    it("should return 400 if validation fails", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "", // Invalid email
        password: "", // Invalid password
      });

      expect(response.status).toBe(400); // Adjust based on your validation
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Password or Email invalid");
    });

    it("should return 401 if authentication fails", async () => {
      // Mocking failed loginService response
      loginService.mockResolvedValue(null);

      const response = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongPassword",
      });

      expect(response.status).toBe(401); // Adjust based on your error handling
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Password or Email invalid");
    });
  });
});

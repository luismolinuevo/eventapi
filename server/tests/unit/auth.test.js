import { loginController } from "../../src/controllers/auth";
import { ValidationError, AuthError, ProgrammingError } from "../../src/utils/exceptions";
import { loginService } from "../../src/services/auth";
import { validateAuthData } from "../../src/schemas/auth";

jest.mock("../../src/services/auth");
jest.mock("../../src/schemas/auth");

describe("loginController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        email: "test1@gmail.com",
        password: "test1111",
      },
    };
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should handle valid credentials", async () => {
    validateAuthData.mockReturnValue(true);
    loginService.mockResolvedValue({
      access_token: "fakeAccessToken",
      refresh_token: "fakeRefreshToken",
    });

    await loginController(req, res, next);

    expect(res.cookie).toHaveBeenCalledWith("accessToken", "fakeAccessToken", expect.any(Object));
    expect(res.cookie).toHaveBeenCalledWith("refreshToken", "fakeRefreshToken", expect.any(Object));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User login success",
    });
  });

  it("should handle validation errors", async () => {
    validateAuthData.mockReturnValue(false);

    await loginController(req, res, next);

    expect(next).toHaveBeenCalledWith(new ValidationError("Password or Email invalid"));
  });

  it("should handle authentication errors", async () => {
    validateAuthData.mockReturnValue(true);
    loginService.mockResolvedValue(null);

    await loginController(req, res, next);

    expect(next).toHaveBeenCalledWith(new AuthError("Password or Email invalid"));
  });

  it("should handle unexpected errors", async () => {
    validateAuthData.mockReturnValue(true);
    loginService.mockRejectedValue(new Error("Unexpected error"));

    await loginController(req, res, next);

    expect(next).toHaveBeenCalledWith(new ProgrammingError());
  });
});

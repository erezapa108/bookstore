process.env.JWT_SECRET = "test-secret"; // wajib di-set SEBELUM require verifyToken

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const { verifyToken } = require("./verifyToken");

describe("verifyToken middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {}, path: "/api/auth/me" };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test("mengembalikan 401 kalau token tidak ada", () => {
    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token tidak ditemukan" });
    expect(next).not.toHaveBeenCalled();
  });

  test("mengembalikan 401 kalau format header tidak valid", () => {
    req.headers.authorization = "Token abc";

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token tidak ditemukan" });
    expect(next).not.toHaveBeenCalled();
  });

  test("mengembalikan 401 kalau token kadaluarsa", () => {
    req.headers.authorization = "Bearer expired-token";
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback({ name: "TokenExpiredError" });
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token kadaluarsa" });
    expect(next).not.toHaveBeenCalled();
  });

  test("mengembalikan 401 kalau token tidak valid", () => {
    req.headers.authorization = "Bearer invalid-token";
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(new Error("invalid signature"));
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token tidak valid" });
    expect(next).not.toHaveBeenCalled();
  });

  test("mengembalikan 401 kalau payload token tidak punya id", () => {
    req.headers.authorization = "Bearer token-tanpa-id";
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(null, { role: "admin" }); // tidak ada field id
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token tidak valid" });
    expect(next).not.toHaveBeenCalled();
  });

  test("menyimpan decoded user dan memanggil next kalau token valid", () => {
    req.headers.authorization = "Bearer valid-token";
    const decodedUser = { id: 7, role: "admin" };
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(null, decodedUser);
    });

    verifyToken(req, res, next);

    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("memverifikasi token dengan algorithms yang dibatasi", () => {
    req.headers.authorization = "Bearer some-token";
    jwt.verify.mockImplementation((token, secret, options, callback) => {
      callback(null, { id: 1, role: "user" });
    });

    verifyToken(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "some-token",
      "test-secret",
      { algorithms: ["HS256"] },
      expect.any(Function),
    );
  });
});

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");

describe("verifyToken middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    process.env.NODE_ENV = "development";
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
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback({ name: "TokenExpiredError" });
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token kadaluarsa" });
    expect(next).not.toHaveBeenCalled();
  });

  test("mengembalikan 401 kalau token tidak valid", () => {
    req.headers.authorization = "Bearer invalid-token";
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("invalid signature"));
    });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token tidak valid" });
    expect(next).not.toHaveBeenCalled();
  });

  test("menyimpan decoded user dan memanggil next kalau token valid", () => {
    req.headers.authorization = "Bearer valid-token";
    const decodedUser = { id: 7, role: "admin" };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decodedUser);
    });

    verifyToken(req, res, next);

    expect(req.user).toEqual(decodedUser);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});

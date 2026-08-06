jest.mock("../config/db", () => ({
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn(),
}));

const request = require("supertest");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../app");

jest.mock("../models/userModel");
const userModel = require("../models/userModel");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("POST /api/auth/register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("berhasil register dengan data valid", async () => {
    userModel.findUserByEmail.mockImplementation((email, callback) => {
      callback(null, []); // belum ada user dengan email ini
    });
    bcrypt.hash.mockImplementation((password, saltRounds, callback) => {
      callback(null, "hashed_password_palsu");
    });
    userModel.createUser.mockImplementation((userData, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Ezra",
      email: "ezra@test.com",
      password: "rahasia123",
    });

    expect(response.status).toBe(201);
  });

  test("role SELALU dipaksa jadi 'user', meski dikirim 'admin' di body", async () => {
    userModel.findUserByEmail.mockImplementation((email, callback) => {
      callback(null, []);
    });
    bcrypt.hash.mockImplementation((password, saltRounds, callback) => {
      callback(null, "hashed_password_palsu");
    });
    userModel.createUser.mockImplementation((userData, callback) => {
      callback(null, { insertId: 1 });
    });

    await request(app).post("/api/auth/register").send({
      name: "Orang Iseng",
      email: "iseng@test.com",
      password: "rahasia123",
      role: "admin", // percobaan celah keamanan
    });

    // Ini test yang PALING PENTING di sprint ini:
    // pastikan userModel.createUser dipanggil dengan role "user",
    // TIDAK PEDULI apa yang dikirim di request body.
    expect(userModel.createUser).toHaveBeenCalledWith(
      expect.objectContaining({ role: "user" }),
      expect.any(Function),
    );
  });

  test("ditolak (400) kalau email sudah terdaftar", async () => {
    userModel.findUserByEmail.mockImplementation((email, callback) => {
      callback(null, [{ id: 1, email: "sudahada@test.com" }]); // sudah ada
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Duplikat",
      email: "sudahada@test.com",
      password: "rahasia123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email sudah terdaftar");
  });

  test("ditolak (400) kalau field wajib kosong", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "",
      email: "",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(userModel.findUserByEmail).not.toHaveBeenCalled(); // berhenti sebelum sempat cek database
  });
});

describe("POST /api/auth/login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("berhasil login dengan kredensial benar, mengembalikan token", async () => {
    userModel.findUserByEmail.mockImplementation((email, callback) => {
      callback(null, [
        {
          id: 1,
          name: "Admin",
          email: "admin@test.com",
          password_hash: "hashed",
          role: "admin",
        },
      ]);
    });
    bcrypt.compare.mockImplementation((password, hash, callback) => {
      callback(null, true); // password cocok
    });
    jwt.sign.mockReturnValue("token_palsu_untuk_test");

    const response = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "passwordbenar",
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("token_palsu_untuk_test");
    expect(response.body.user.role).toBe("admin");
  });

  test("ditolak (401) kalau password salah", async () => {
    userModel.findUserByEmail.mockImplementation((email, callback) => {
      callback(null, [
        {
          id: 1,
          email: "admin@test.com",
          password_hash: "hashed",
          role: "admin",
        },
      ]);
    });
    bcrypt.compare.mockImplementation((password, hash, callback) => {
      callback(null, false); // password TIDAK cocok
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "admin@test.com",
      password: "passwordsalah",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email atau password salah");
    expect(jwt.sign).not.toHaveBeenCalled(); // token TIDAK BOLEH dibuat kalau password salah
  });

  test("ditolak (401) kalau email tidak terdaftar, pesan SAMA seperti password salah", async () => {
    userModel.findUserByEmail.mockImplementation((email, callback) => {
      callback(null, []); // tidak ketemu
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "tidakada@test.com",
      password: "apapun",
    });

    expect(response.status).toBe(401);
    // Pesan harus SAMA PERSIS dengan kasus password salah -- mencegah user enumeration
    expect(response.body.message).toBe("Email atau password salah");
  });
});

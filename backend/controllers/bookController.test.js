const request = require("supertest");
const app = require("../app");

// jest.mock mengganti seluruh isi bookModel dengan versi palsu.
// Tujuannya: test ini menguji CONTROLLER + MIDDLEWARE + ROUTING,
// TANPA benar-benar menyentuh database asli.
// Kalau pakai database asli, test jadi lambat, butuh setup DB khusus,
// dan bisa gagal karena alasan yang tidak ada hubungannya dengan kode
// (misal: koneksi database sedang down).
jest.mock("../models/bookModel");
const bookModel = require("../models/bookModel");

describe("POST /api/books", () => {
  afterEach(() => {
    jest.clearAllMocks(); // reset mock antar test, supaya tidak "bocor" ke test lain
  });

  test("berhasil menambah buku dengan data valid", async () => {
    // Atur bookModel.addBook (versi palsu) supaya berperilaku seolah sukses
    bookModel.addBook.mockImplementation((data, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app)
      .post("/api/books")
      .send({
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        price: 50000,
        stock: 10,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Buku berhasil ditambahkan");
  });

  test("ditolak (400) kalau title kosong, model tidak boleh sampai terpanggil", async () => {
    const response = await request(app)
      .post("/api/books")
      .send({ title: "", author: "Andrea Hirata", price: 50000, stock: 10 });

    expect(response.status).toBe(400);
    // Ini yang membuktikan middleware validasi benar-benar MENCEGAT request
    // sebelum sampai ke model/database sama sekali.
    expect(bookModel.addBook).not.toHaveBeenCalled();
  });
});

describe("PUT /api/books/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("berhasil update kalau buku ditemukan", async () => {
    bookModel.updateBook.mockImplementation((id, data, callback) => {
      callback(null, { affectedRows: 1 }); // simulasikan 1 baris berhasil diupdate
    });

    const response = await request(app)
      .put("/api/books/1")
      .send({
        title: "Judul Baru",
        author: "Andrea Hirata",
        price: 60000,
        stock: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Buku berhasil diperbarui");
  });

  test("mengembalikan 404 kalau id tidak ditemukan di database", async () => {
    bookModel.updateBook.mockImplementation((id, data, callback) => {
      callback(null, { affectedRows: 0 }); // simulasikan tidak ada baris yang cocok
    });

    const response = await request(app)
      .put("/api/books/999")
      .send({
        title: "Judul Baru",
        author: "Andrea Hirata",
        price: 60000,
        stock: 5,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Buku tidak ditemukan");
  });

  test("mengembalikan 500 kalau database error", async () => {
    bookModel.updateBook.mockImplementation((id, data, callback) => {
      callback(new Error("Koneksi database terputus"), null); // simulasikan error
    });

    const response = await request(app)
      .put("/api/books/1")
      .send({
        title: "Judul Baru",
        author: "Andrea Hirata",
        price: 60000,
        stock: 5,
      });

    expect(response.status).toBe(500);
  });
});

const validateBook = require("./validateBook");

// "describe" mengelompokkan beberapa test yang berhubungan,
// supaya hasilnya di terminal rapi dan mudah dibaca per kelompok.
describe("validateBook middleware", () => {
  // Helper untuk membuat objek req/res palsu (mock).
  // Kita tidak butuh Express beneran jalan untuk test middleware -
  // cukup tiru bentuknya saja (req.body, res.status, res.json, next).
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res); // res.status(400) mengembalikan res lagi (chaining)
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  test("lolos (next dipanggil) kalau semua data valid", () => {
    const req = {
      body: {
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        price: 50000,
        stock: 10,
      },
    };
    const res = mockResponse();
    const next = jest.fn(); // fungsi palsu, kita cuma cek apakah dipanggil atau tidak

    validateBook(req, res, next);

    expect(next).toHaveBeenCalled(); // next() harus dipanggil kalau data valid
    expect(res.status).not.toHaveBeenCalled(); // tidak boleh ada response error
  });

  test("ditolak kalau title kosong", () => {
    const req = {
      body: { title: "", author: "Andrea Hirata", price: 50000, stock: 10 },
    };
    const res = mockResponse();
    const next = jest.fn();

    validateBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled(); // next() TIDAK boleh dipanggil kalau data invalid
  });

  test("ditolak kalau author kosong", () => {
    const req = {
      body: { title: "Laskar Pelangi", author: "", price: 50000, stock: 10 },
    };
    const res = mockResponse();
    const next = jest.fn();

    validateBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  // Ini test untuk celah yang kita perbaiki sebelumnya (price undefined lolos validasi)
  test("ditolak kalau price tidak dikirim sama sekali", () => {
    const req = {
      body: { title: "Laskar Pelangi", author: "Andrea Hirata", stock: 10 },
    }; // price sengaja dihilangkan
    const res = mockResponse();
    const next = jest.fn();

    validateBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("ditolak kalau price negatif atau nol", () => {
    const req = {
      body: {
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        price: -5000,
        stock: 10,
      },
    };
    const res = mockResponse();
    const next = jest.fn();

    validateBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("ditolak kalau stock negatif", () => {
    const req = {
      body: {
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        price: 50000,
        stock: -1,
      },
    };
    const res = mockResponse();
    const next = jest.fn();

    validateBook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("lolos kalau stock 0 (boleh stok kosong, asal tidak negatif)", () => {
    const req = {
      body: {
        title: "Laskar Pelangi",
        author: "Andrea Hirata",
        price: 50000,
        stock: 0,
      },
    };
    const res = mockResponse();
    const next = jest.fn();

    validateBook(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

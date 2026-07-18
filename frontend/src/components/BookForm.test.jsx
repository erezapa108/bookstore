import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import BookForm from "./BookForm";

describe("BookForm", () => {
  test("menampilkan tombol 'Tambah Buku' saat editingBook null", () => {
    render(<BookForm editingBook={null} onSubmit={() => {}} />);
    expect(screen.getByText("Tambah Buku")).toBeInTheDocument();
  });

  test("menampilkan tombol 'Simpan Perubahan' saat editingBook terisi", () => {
    const book = {
      id: 1,
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      price: 50000,
      stock: 10,
    };
    render(<BookForm editingBook={book} onSubmit={() => {}} />);
    expect(screen.getByText("Simpan Perubahan")).toBeInTheDocument();
  });

  test("mengisi input otomatis dari editingBook", () => {
    const book = {
      id: 1,
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      price: 50000,
      stock: 10,
    };
    render(<BookForm editingBook={book} onSubmit={() => {}} />);

    // getByDisplayValue mencari <input> berdasarkan NILAI yang sedang ditampilkan, bukan teks statis
    expect(screen.getByDisplayValue("Laskar Pelangi")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Andrea Hirata")).toBeInTheDocument();
  });

  test("mengosongkan form saat editingBook kembali jadi null", () => {
    const book = {
      id: 1,
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      price: 50000,
      stock: 10,
    };
    const { rerender } = render(
      <BookForm editingBook={book} resetKey={0} onSubmit={() => {}} />,
    );

    expect(screen.getByDisplayValue("Laskar Pelangi")).toBeInTheDocument();

    // "rerender" mensimulasikan Home.jsx mengirim props baru (persis seperti setEditingBook(null))
    rerender(<BookForm editingBook={null} resetKey={1} onSubmit={() => {}} />);

    expect(
      screen.queryByDisplayValue("Laskar Pelangi"),
    ).not.toBeInTheDocument();
  });

  test("memanggil onSubmit dengan data form saat disubmit", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<BookForm editingBook={null} onSubmit={handleSubmit} />);

    await user.type(
      screen.getByPlaceholderText("Masukkan judul buku"),
      "Buku Baru",
    );
    await user.type(
      screen.getByPlaceholderText("Masukkan nama penulis"),
      "Penulis Baru",
    );
    await user.type(
      screen.getByPlaceholderText("Masukkan harga buku"),
      "75000",
    );
    await user.type(screen.getByPlaceholderText("Masukkan jumlah stok"), "5");

    await user.click(screen.getByText("Tambah Buku"));

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "Buku Baru",
      author: "Penulis Baru",
      price: "75000", // tetap string, karena input HTML selalu mengembalikan string sebelum di-parse
      stock: "5",
    });
  });
});

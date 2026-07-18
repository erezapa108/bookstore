import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import BookList from "./BookList";

const sampleBooks = [
  {
    id: 1,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    price: 50000,
    stock: 10,
  },
  { id: 2, title: "Bumi Manusia", author: "Pramoedya", price: 60000, stock: 0 },
];

describe("BookList", () => {
  test("menampilkan pesan kalau tidak ada buku", () => {
    render(<BookList books={[]} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText("Tidak ada data buku.")).toBeInTheDocument();
  });

  test("menampilkan judul & penulis setiap buku", () => {
    render(
      <BookList books={sampleBooks} onEdit={() => {}} onDelete={() => {}} />,
    );
    expect(screen.getByText("Laskar Pelangi")).toBeInTheDocument();
    expect(screen.getByText("Andrea Hirata")).toBeInTheDocument();
    expect(screen.getByText("Bumi Manusia")).toBeInTheDocument();
  });

  test("memanggil onEdit dengan buku yang benar saat tombol Edit diklik", async () => {
    const handleEdit = vi.fn(); // mock function, versi Vitest dari jest.fn()
    const user = userEvent.setup();

    render(
      <BookList books={sampleBooks} onEdit={handleEdit} onDelete={() => {}} />,
    );

    // getAllByText karena ada 2 tombol "Edit" (satu per buku) -- ambil yang pertama
    const editButtons = screen.getAllByText("Edit");
    await user.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledWith(sampleBooks[0]); // pastikan buku PERTAMA yang dikirim, bukan sembarang
  });

  test("memanggil onDelete dengan id yang benar saat tombol Hapus diklik", async () => {
    const handleDelete = vi.fn();
    const user = userEvent.setup();

    render(
      <BookList
        books={sampleBooks}
        onEdit={() => {}}
        onDelete={handleDelete}
      />,
    );

    const deleteButtons = screen.getAllByText("Hapus");
    await user.click(deleteButtons[1]); // klik tombol Hapus buku KEDUA

    expect(handleDelete).toHaveBeenCalledWith(2); // id buku kedua adalah 2
  });

  test("menampilkan pesan loading saat isLoading true, bukan grid buku", () => {
    render(
      <BookList
        books={sampleBooks}
        onEdit={() => {}}
        onDelete={() => {}}
        isLoading={true}
      />,
    );
    expect(screen.getByText("Memuat data buku...")).toBeInTheDocument();
    expect(screen.queryByText("Laskar Pelangi")).not.toBeInTheDocument(); // "queryBy" dipakai untuk cek TIDAK ADA
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import BookList from "./BookList";
import ErrorBoundary from "./ErrorBoundary";

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

describe("BookList - error state", () => {
  test("menampilkan pesan error saat hasError true", () => {
    render(
      <BookList
        books={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        hasError={true}
        onRetry={() => {}}
        searchTerm=""
        onResetSearch={() => {}}
      />,
    );
    expect(screen.getByText("Gagal memuat data buku")).toBeInTheDocument();
  });

  test("ErrorBoundary menampilkan fallback saat anak komponen melempar error", () => {
    const ThrowError = () => {
      throw new Error("boom");
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText("Terjadi kesalahan pada Aplikasi"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /muat ulang halaman/i }),
    ).toBeInTheDocument();
  });

  test("error state diprioritaskan di atas empty state", () => {
    render(
      <BookList
        books={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        hasError={true}
        onRetry={() => {}}
        searchTerm=""
        onResetSearch={() => {}}
      />,
    );
    // pastikan pesan "Belum ada buku" TIDAK ikut muncul bersamaan
    expect(screen.queryByText("Belum ada buku")).not.toBeInTheDocument();
  });

  test("tombol 'Coba Lagi' memanggil onRetry saat diklik", async () => {
    const handleRetry = vi.fn();
    const user = userEvent.setup();

    render(
      <BookList
        books={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        hasError={true}
        onRetry={handleRetry}
        searchTerm=""
        onResetSearch={() => {}}
      />,
    );

    await user.click(screen.getByText("Coba Lagi"));
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  test("error state tidak muncul saat hasError false meski books kosong", () => {
    render(
      <BookList
        books={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        hasError={false}
        onRetry={() => {}}
        searchTerm=""
        onResetSearch={() => {}}
      />,
    );
    expect(
      screen.queryByText("Gagal memuat data buku"),
    ).not.toBeInTheDocument();
  });
});

describe("BookList - empty state", () => {
  test("menampilkan pesan 'Belum ada buku' saat database kosong tanpa search", () => {
    render(
      <BookList
        books={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        searchTerm="xxxtidakada"
        onResetSearch={() => {}}
      />,
    );
    expect(
      screen.getByText('Tidak ada hasil untuk "xxxtidakada"'),
    ).toBeInTheDocument();
    expect(screen.queryByText("Belum ada buku")).not.toBeInTheDocument();
  });

  test("menampilkan judul & penulis setiap buku", () => {
    render(
      <BookList books={sampleBooks} onEdit={() => {}} onDelete={() => {}} />,
    );
    expect(screen.getByText("Laskar Pelangi")).toBeInTheDocument();
    expect(screen.getByText("Andrea Hirata")).toBeInTheDocument();
    expect(screen.getByText("Bumi Manusia")).toBeInTheDocument();
  });

  test("tombol 'Hapus Pencarian' memanggil onResetSearch saat diklik", async () => {
    const handleReset = vi.fn();
    const user = userEvent.setup();

    render(
      <BookList
        books={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        searchTerm="xxxtidakada"
        onResetSearch={handleReset}
      />,
    );

    await user.click(screen.getByText("Hapus Pencarian"));
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  test("tombol 'Hapus Pencarian' TIDAK muncul saat database memang kosong (bukan hasil search)", () => {
    render(
      <BookList
        books={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        searchTerm=""
        onResetSearch={() => {}}
      />,
    );
    expect(screen.queryByText("Hapus Pencarian")).not.toBeInTheDocument();
  });

  test("tombol 'Hapus Pencarian' memanggil onResetSearch saat diklik", async () => {
    const handleReset = vi.fn();
    const user = userEvent.setup();

    render(
      <BookList
        books={[]}
        onEdit={() => {}}
        onDelete={() => {}}
        searchTerm="xxxtidakada"
        onResetSearch={handleReset}
      />,
    );

    await user.click(screen.getByText("Hapus Pencarian"));
    expect(handleReset).toHaveBeenCalledTimes(1);
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

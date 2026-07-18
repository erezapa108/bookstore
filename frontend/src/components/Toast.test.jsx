import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import Toast from "./Toast";

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // ganti timer asli dengan versi palsu yang bisa kita kontrol manual
  });

  afterEach(() => {
    vi.useRealTimers(); // WAJIB dikembalikan setelah test, supaya tidak bocor ke test lain
  });

  test("menampilkan pesan yang diberikan", () => {
    render(
      <Toast
        message="Buku berhasil ditambahkan."
        type="success"
        onClose={() => {}}
      />,
    );
    expect(screen.getByText("Buku berhasil ditambahkan.")).toBeInTheDocument();
  });

  test("memanggil onClose otomatis setelah 3 detik", () => {
    const handleClose = vi.fn();
    render(<Toast message="Test" type="success" onClose={handleClose} />);

    expect(handleClose).not.toHaveBeenCalled(); // belum 3 detik, belum boleh terpanggil

    vi.advanceTimersByTime(3000); // "percepat" waktu 3 detik tanpa benar-benar menunggu

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  test("tidak memanggil onClose sebelum 3 detik", () => {
    const handleClose = vi.fn();
    render(<Toast message="Test" type="success" onClose={handleClose} />);

    vi.advanceTimersByTime(2999); // 1 milidetik sebelum batas waktu

    expect(handleClose).not.toHaveBeenCalled();
  });
});

import { render, screen, act, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Home from "./Home";
import { getBooks } from "../api/bookApi";

vi.mock("../api/bookApi", () => ({
  getBooks: vi.fn(),
  createBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
}));

vi.mock("../components/BookForm", () => ({
  default: () => <div data-testid="book-form" />,
}));

vi.mock("../components/BookList", () => ({
  default: () => <div data-testid="book-list" />,
}));

vi.mock("../components/Toast", () => ({
  default: () => null,
}));

describe("Home debounce search", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    getBooks.mockResolvedValue({
      data: {
        data: [],
        pagination: {
          page: 1,
          totalPages: 1,
          total: 0,
        },
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("menunggu 500ms sebelum fetch dengan kata kunci terbaru", async () => {
    render(<Home />);

    expect(getBooks).toHaveBeenCalledTimes(1);
    expect(getBooks).toHaveBeenLastCalledWith(1, 10, "", expect.anything());

    const input = screen.getByPlaceholderText(
      "Cari judul buku atau penulis...",
    );
    fireEvent.change(input, { target: { value: "harry" } });

    expect(getBooks).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(getBooks).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(1);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(getBooks).toHaveBeenCalledTimes(2);
    expect(getBooks).toHaveBeenLastCalledWith(
      1,
      10,
      "harry",
      expect.anything(),
    );
  });
});

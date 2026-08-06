import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import ProtectedRoute from "./ProtectedRoute";

vi.mock("../hooks/useAuth");
import { useAuth } from "../hooks/useAuth";

function renderWithRouter(allowedRoles) {
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <p>Konten Rahasia</p>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<p>Halaman Login</p>} />
        <Route path="/" element={<p>Halaman Home</p>} />
        <Route path="/shop" element={<p>Halaman Shop</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  test("Menampilkan 'Memuat...' saat isCheckingAuth masih true", () => {
    useAuth.mockReturnValue({ user: null, isCheckingAuth: true });

    renderWithRouter(["admin"]);

    expect(screen.getByText("Memuat...")).toBeInTheDocument();
    expect(screen.queryByText("Konten Rahasia")).not.toBeInTheDocument();
  });

  test("redirect ke /login jika belum login", () => {
    useAuth.mockReturnValue({ user: null, isCheckingAuth: false });

    renderWithRouter(["admin"]);

    expect(screen.getByText("Halaman Login")).toBeInTheDocument();
    expect(screen.queryByText("Konten Rahasia")).not.toBeInTheDocument();
  });

  test("redirect ke /shop jika role user mencoba akses route khusus admin", () => {
    useAuth.mockReturnValue({
      user: { id: 2, role: "user" },
      isCheckingAuth: false,
    });

    renderWithRouter(["admin"]);

    expect(screen.getByText("Halaman Shop")).toBeInTheDocument();
  });

  test("redirect ke / jika admin mencoba akses route khusus user", () => {
    useAuth.mockReturnValue({
      user: { id: 1, role: "admin" },
      isCheckingAuth: false,
    });

    renderWithRouter(["user"]);

    expect(screen.getByText("Halaman Home")).toBeInTheDocument();
  });
});

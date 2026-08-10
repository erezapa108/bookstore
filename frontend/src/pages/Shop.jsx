import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import useDebounce from "../hooks/useDebounce";
import { getBooks } from "../api/bookApi";

const PAGE_SIZE = 8;

function Shop() {
  const { user } = useAuth();
  const {
    cartItems,
    wishlistIds,
    addToCart,
    removeFromCart,
    toggleWishlist,
    subtotal,
    totalItems,
  } = useCart();

  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const [notice, setNotice] = useState(
    "Pilih buku favoritmu dan mulai belanja.",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset ke halaman 1 saat kata kunci pencarian berubah.
  // Dihitung langsung saat render (bukan lewat effect terpisah) supaya
  // tidak ada render "nyasar" ke halaman lama sebelum reset diterapkan.
  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  useEffect(() => {
    const controller = new AbortController();

    const loadBooks = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await getBooks(
          page,
          PAGE_SIZE,
          debouncedSearch,
          controller.signal,
        );
        const payload = response.data;
        setBooks(payload.data || []);
        setTotalPages(payload.totalPages || 1); // ⚠️ sesuaikan nama field kalau beda
      } catch (error) {
        if (error.code !== "ERR_CANCELED") {
          setHasError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
    return () => controller.abort();
  }, [page, debouncedSearch]);

  const handleAddToCart = (book) => {
    addToCart(book);
    setNotice(`${book.title} ditambahkan ke keranjang.`);
  };

  const wishlistBooks = books.filter((book) => wishlistIds.includes(book.id));

  const handleCheckout = () => {
    // Placeholder sampai sprint checkout diimplementasikan
    alert("Fitur checkout belum tersedia. Segera hadir!");
  };

  return (
    <div
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "8px 20px 40px" }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 0.8fr",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <div>
          <p style={{ margin: 0, color: "#2F6F5E", fontWeight: 700 }}>
            Belanja buku favoritmu
          </p>
          <h1 style={{ margin: "8px 0", color: "#2F6F5E", fontSize: "32px" }}>
            Selamat datang di{" "}
            <span style={{ color: "#C1533E" }}>Bookzone.id</span>
          </h1>
          <p style={{ margin: "0 0 16px", color: "#3D3A34", lineHeight: 1.6 }}>
            Rak buku modern, promo mingguan, dan wishlist yang selalu siap kamu
            buka kapan saja.
          </p>

          <input
            type="text"
            placeholder="Cari judul atau penulis..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "360px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "1px solid #DDD6C4",
              marginBottom: "16px",
            }}
          />
        </div>

        <div style={panelStyle}>
          <p style={{ margin: 0, color: "#2F6F5E", fontWeight: 700 }}>
            Profil user
          </p>
          <h3 style={{ margin: "8px 0", color: "#3D3A34" }}>
            {user?.name || "Pengguna Bookzone"}
          </h3>
          <p style={{ margin: 0, color: "#6B7280" }}>
            {user?.email || "Belum ada email"}
          </p>
          <div
            style={{
              marginTop: "14px",
              padding: "12px",
              background: "#F8F4EA",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span>Wishlist</span>
              <strong>{wishlistBooks.length}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Keranjang</span>
              <strong>{totalItems}</strong>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "20px",
          marginTop: "24px",
        }}
      >
        <div>
          <div style={panelStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <h3 style={{ margin: 0, color: "#2F6F5E" }}>Katalog Buku</h3>
              <span style={{ color: "#C1533E", fontWeight: 600 }}>
                {notice}
              </span>
            </div>

            {isLoading ? (
              <p style={{ margin: 0, color: "#6B7280" }}>
                Memuat buku dari database...
              </p>
            ) : hasError ? (
              <p style={{ margin: 0, color: "#C1533E" }}>
                Gagal memuat buku. Coba lagi nanti.
              </p>
            ) : books.length === 0 ? (
              <p style={{ margin: 0, color: "#6B7280" }}>
                Tidak ada buku yang cocok dengan pencarian.
              </p>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: "14px",
                  }}
                >
                  {books.map((book) => {
                    const inWishlist = wishlistIds.includes(book.id);
                    return (
                      <div
                        key={book.id}
                        style={{
                          border: "1px solid #E8DFCC",
                          borderRadius: "16px",
                          padding: "14px",
                          background: "#fff",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                          }}
                        >
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "999px",
                              background: "#F4EEDC",
                              color: "#2F6F5E",
                              fontSize: "12px",
                            }}
                          >
                            {book.category || "Umum"} {/* ⚠️ sesuaikan field */}
                          </span>
                          <button
                            onClick={() => toggleWishlist(book.id)}
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              fontSize: "18px",
                            }}
                          >
                            {inWishlist ? "♥" : "♡"}
                          </button>
                        </div>
                        <h4 style={{ margin: "6px 0", color: "#3D3A34" }}>
                          {book.title}
                        </h4>
                        <p
                          style={{
                            margin: "0 0 8px",
                            color: "#6B7280",
                            fontSize: "13px",
                          }}
                        >
                          {book.author}
                        </p>
                        <p
                          style={{
                            margin: "0 0 10px",
                            color: "#3D3A34",
                            fontSize: "14px",
                          }}
                        >
                          {book.description || "Deskripsi belum tersedia."}{" "}
                          {/* ⚠️ sesuaikan field */}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <strong style={{ color: "#2F6F5E" }}>
                            Rp {Number(book.price).toLocaleString("id-ID")}
                          </strong>
                          <button
                            onClick={() => handleAddToCart(book)}
                            disabled={book.stock === 0} // ⚠️ sesuaikan field stok
                            style={{
                              border: "none",
                              background:
                                book.stock === 0 ? "#D3D3D3" : "#2F6F5E",
                              color: "#fff",
                              padding: "8px 10px",
                              borderRadius: "8px",
                              cursor:
                                book.stock === 0 ? "not-allowed" : "pointer",
                            }}
                          >
                            {book.stock === 0 ? "Stok habis" : "+ Keranjang"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "8px",
                      marginTop: "16px",
                    }}
                  >
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      style={pageButtonStyle}
                    >
                      Sebelumnya
                    </button>
                    <span style={{ padding: "8px 12px", color: "#3D3A34" }}>
                      Halaman {page} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      style={pageButtonStyle}
                    >
                      Berikutnya
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div style={{ ...panelStyle, marginTop: "16px" }}>
            <h3 style={{ margin: "0 0 10px", color: "#2F6F5E" }}>Wishlist</h3>
            {wishlistBooks.length === 0 ? (
              <p style={{ margin: 0, color: "#6B7280" }}>
                Wishlist masih kosong.
              </p>
            ) : (
              wishlistBooks.map((book) => (
                <div
                  key={book.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #F0E9DA",
                  }}
                >
                  <div>
                    <strong>{book.title}</strong>
                    <p
                      style={{
                        margin: "2px 0 0",
                        color: "#6B7280",
                        fontSize: "13px",
                      }}
                    >
                      {book.author}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleWishlist(book.id)}
                    style={{
                      border: "none",
                      background: "#FFF5E8",
                      color: "#C1533E",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={panelStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, color: "#2F6F5E" }}>Keranjang Belanja</h3>
            <span style={{ color: "#C1533E", fontWeight: 700 }}>
              {totalItems} item
            </span>
          </div>

          {cartItems.length === 0 ? (
            <p style={{ color: "#6B7280", margin: "14px 0" }}>
              Keranjangmu masih kosong. Tambahkan buku favoritmu dulu.
            </p>
          ) : (
            <div style={{ marginTop: "12px" }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid #F0E9DA",
                  }}
                >
                  <div>
                    <strong>{item.title}</strong>
                    <p
                      style={{
                        margin: "2px 0 0",
                        color: "#6B7280",
                        fontSize: "13px",
                      }}
                    >
                      Qty {item.qty}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      border: "none",
                      background: "#FCE9E6",
                      color: "#C1533E",
                      padding: "6px 10px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              borderTop: "1px solid #E8DFCC",
              marginTop: "16px",
              paddingTop: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span>Subtotal</span>
              <strong>Rp {subtotal.toLocaleString("id-ID")}</strong>
            </div>
            <button
              onClick={handleCheckout}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: cartItems.length === 0 ? "#D3D3D3" : "#2F6F5E",
                color: "#fff",
                cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
              }}
              disabled={cartItems.length === 0}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const panelStyle = {
  background: "#fff",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 12px 30px rgba(61, 58, 52, 0.08)",
  border: "1px solid #EEE7D7",
};

const pageButtonStyle = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #DDD6C4",
  background: "#fff",
  cursor: "pointer",
};

export default Shop;

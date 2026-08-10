import { useState, useMemo, useEffect } from "react";
import { CartContext } from "./CartContextInstance";

const CART_KEY = "cartItems";
const WISHLIST_KEY = "wishlistIds";

function safeParse(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Data ${key} di localStorage rusak, direset:`, error);
    localStorage.removeItem(key);
    return fallback;
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => safeParse(CART_KEY, []));
  const [wishlistIds, setWishlistIds] = useState(() =>
    safeParse(WISHLIST_KEY, []),
  );

  // Setiap kali cartItems/wishlistIds berubah, simpan otomatis ke localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const addToCart = (book) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...book, qty: 1 }];
    });
  };

  const removeFromCart = (bookId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId));
  };

  const updateQty = (bookId, qty) => {
    if (qty < 1) return removeFromCart(bookId);
    setCartItems((prev) =>
      prev.map((item) => (item.id === bookId ? { ...item, qty } : item)),
    );
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (bookId) => {
    setWishlistIds((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId],
    );
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + Number(item.price) * item.qty, 0),
    [cartItems],
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.qty, 0),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistIds,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        toggleWishlist,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

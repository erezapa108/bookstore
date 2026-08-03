// import axios untuk HTTP request
import axios from "axios";

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
    baseURL: "http://localhost:5000/api", //Alamat backend express
});

// Fungsi untuk mengambil semua data buku
export const getBooks = (page = 1, limit = 10, search = "", signal) => {
  return api.get("/books", {
    params: { page, limit, search }, signal, // dikirim ke axios untuk membatalkan request
  });
};

// Mengirim data buku ke backend
export const createBook = (bookData) => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    
    return api.post(
        "/books",
        bookData,
        {
            headers: {
                Authorization: `Bearer ${token}`, // Sertakan token di header Authorization
            },
        }
    );
};



// Mengirim data perubahan buku ke backend berdasarkan ID
export const updateBook = (id, bookData) => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    
    return api.put(
        `/books/${id}`,
        bookData,
        {
            headers: {
                Authorization: `Bearer ${token}`, // Sertakan token di header Authorization
            },
        }
    );
};

// Menambahkan fungsi deleteBook kedalam bookApi
export const deleteBook = (id) => {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    
    return api.delete(
        `/books/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`, // Sertakan token di header Authorization
            },
        }
    );
};
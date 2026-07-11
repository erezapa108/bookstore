// import axios untuk HTTP request
import axios from "axios";

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
    baseURL: "http://localhost:5000/api", //Alamat backend express
});

// Fungsi untuk mengambil semua data buku
export const getBooks = () => {
    return api.get("/books"); //mengirim GET request ke endpoint /books
}

// Mengirim data buku ke backend
export const createBook = (bookData) => {
    return api.post("/books", bookData);
};



// Mengirim data perubahan buku ke backend berdasarkan ID
export const updateBook = (id, bookData) => {
    return api.put(`/books/${id}`, bookData); // mengirim PUT ke /books/:id
};

// Menambahkan fungsi deleteBook kedalam bookApi
export const deleteBook = (id) => {
    return api.delete(`/books/${id}`);
};
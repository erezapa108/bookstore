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
// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Navbar from "./components/navbar";
import ScrollToTopButton from "./components/ScrollToTopButton"; // import baru

function App() {
  return (
    <Router>
      {/* Navbar diletakkan di dalam Router agar jika ada Link di dalamnya tidak error */}
      <Navbar />

      <Routes>
        {/* Halaman Home yang memanggil BookList/BookCard wajib berada di sini */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ScrollToTopButton />
    </Router>
  );
}

export default App;

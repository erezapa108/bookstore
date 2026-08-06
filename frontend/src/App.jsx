import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Login from "./pages/Login";
import ScrollToTopButton from "./components/ScrollToTopButton";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Shop"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Shop />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ScrollToTopButton />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

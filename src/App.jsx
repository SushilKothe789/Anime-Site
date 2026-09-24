import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnimeDetails from "./pages/AnimeDetails";
import "./pages/HomePage.css";
import Footer from "./components/Footer";
import SearchPage from "./pages/SearchPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/anime/:id" element={<AnimeDetails />} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPage />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

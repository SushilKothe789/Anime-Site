import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnimeDetails from "./pages/AnimeDetails";
import './pages/HomePage.css'
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/anime/:id"
          element={<AnimeDetails />}
        />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
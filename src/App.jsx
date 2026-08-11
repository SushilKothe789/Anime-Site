import { BrowserRouter, Routes, Route } from "react-router-dom";
import AnimeDetails from "./pages/AnimeDetails";
import './pages/HomePage.css'
import HomePage from "./pages/HomePage";

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
    </BrowserRouter>
  );
}

export default App;
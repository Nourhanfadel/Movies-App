import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import ErrorBoundary from "./Pages/ErrorBoundary";
import GenrePage from "./Pages/GenrePage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import MovieDetails from "./Pages/MovieDetails";
import SearchPage from "./Pages/SearchPage";
import MoviesList from "./Pages/MoviesList";
// import CategoryPage from "./Pages/CategoryPage";
import Category from "./Pages/Categories";
import FavoritesPage from "./Pages/Favourites";
import Register from "./Pages/Register";
import Login from "./Pages/Login";

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
        <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/genre/:id" element={<GenrePage />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/movies/:category" element={<MoviesList />} />
        <Route path="/category/:type" element={<Category />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />




      </Routes>
        </ErrorBoundary>
        <Footer />
    </BrowserRouter>
  );
};

export default App;

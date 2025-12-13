import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import ErrorBoundary from "./Pages/ErrorBoundary";
import GenrePage from "./Pages/GenrePage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import MovieDetails from "./Pages/MovieDetails";
import SearchPage from "./Pages/SearchPage";
import MoviesList from "./Pages/MoviesList";
import Category from "./Pages/Categories";
import FavoritesPage from "./Pages/Favourites";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import WatchlistPage from "./Pages/WatchlistPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
          <Toaster position="top-center" />

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
        <Route path="/watchlist" element={<WatchlistPage />} />




      </Routes>
        </ErrorBoundary>
        <Footer />
    </BrowserRouter>
  );
};

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import ErrorBoundary from "./Pages/ErrorBoundary";
import GenrePage from "./Pages/GenrePage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import MovieDetails from "./Pages/MovieDetails";
import SearchPage from "./Pages/SearchPage";

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


      </Routes>
        </ErrorBoundary>
        <Footer />
    </BrowserRouter>
  );
};

export default App;

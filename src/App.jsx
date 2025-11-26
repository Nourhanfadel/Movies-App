import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import ErrorBoundary from "./Pages/ErrorBoundary";
import GenrePage from "./Pages/GenrePage";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
        <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/genre/:id" element={<GenrePage />} />

      </Routes>
        </ErrorBoundary>
        <Footer />
    </BrowserRouter>
  );
};

export default App;

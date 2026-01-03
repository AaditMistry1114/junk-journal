import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Journal from "./pages/Journal";
import Stats from "./pages/Stats";
import Gallery from "./pages/Gallery";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Journal />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/gallery" element={<Gallery />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

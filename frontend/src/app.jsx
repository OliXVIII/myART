import React, { useState, useEffect } from "react";
import "./App.scss";
import { Header } from "./components/header/header";
import { Homepage } from "./components/homepage/homepage";
import ArtistList from "./components/ArtistList";
import PaymentPage from "./components/paiement/paymentPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Filter } from "./components/filter/filter.jsx";
import { Art } from "./components/art_page/art.jsx";

function App() {
  const [data, setData] = useState({
    title: "",
    description: "",
  });
  
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/art/:id" element={<Art />} />
          <Route path="/artists" element={<ArtistList />} />
          <Route path="/checkout" element={<PaymentPage />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;

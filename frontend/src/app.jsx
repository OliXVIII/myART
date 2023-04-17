import React, { useState, useEffect } from "react";
import "./App.scss";
import { Header } from "./components/header/header";
import { Homepage } from "./components/homepage/homepage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Filter } from "./components/filter/filter.jsx";
import { Art } from "./components/art_page/art.jsx";
import { SignUp } from "./components/SignUp/SignUp.jsx";
import { Artists } from "./components/artist/artist";
import { ArtistDetails } from "./components/artist-details/artist-details.jsx";
import { Checkout } from "./components/checkout_page/checkout";
import { Login } from './components/signIn/Login.jsx';
import {UserContext} from "./UserContext";

function App() {
  const [data, setData] = useState({
    title: "",
    description: "",
  });
  const [client_id, setClientID] = useState(null);
  return (
    <UserContext.Provider value={{ client_id, setClientID }}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/art/:id" element={<Art />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artist/:id" element={<ArtistDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
     </UserContext.Provider>
  );
}
export default App;

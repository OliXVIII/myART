import React, { useState, useEffect } from "react";
import "./App.scss";
import { Header } from "./components/header/header";
import { Homepage } from "./components/homepage/homepage";

function App() {
  const [data, setData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetch("http://localhost:3001/").then((res) =>
      res.json().then((data) => {
        setData({
          title: data.title,
          description: data.description,
        });
      })
    );
  }, []);

  return (
    <div className="App">
      <Header />
      <Homepage />
        <ArtistList/>
      <Filter />
    </div>
  );
}

export default App;

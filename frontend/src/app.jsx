import React, { useState, useEffect } from "react";
import "./App.scss";
import { Header } from "./components/header/header";
import { Homepage } from "./components/homepage/homepage";
import ArtistList from './components/ArtistList';
import PaymentPage from './components/PaymentPage';

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
      <Router>
        <div className="App">
          <Header/>
          <Switch>
            <Route exact path="/" component={Homepage}/>
            <Route path="/artistes" component={ArtistList}/>
            <Route path="/paiement" component={PaymentPage}/>
          </Switch>
        </div>
      </Router>
  );
}
export default App;

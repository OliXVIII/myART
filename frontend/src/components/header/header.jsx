import React, { useEffect, useState } from "react";
import "./header.scss";

export const Header = () => {
  const [itemsCount, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("myArt_items")) || [];
    const userData = localStorage.getItem("userData") || "";
    setCartItems(items.length);
    setUser(userData);
  }, [localStorage]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="header-logo">
          <img
            className="header-logo-img"
            src="https://static.vecteezy.com/system/resources/previews/007/186/959/original/paint-logo-full-color-luxury-design-style-creative-brush-concept-free-vector.jpg"
          ></img>
          <h2 className="header-logo-text">MyArt</h2>
        </a>
        <div className="header-nav">
          <a href="/" className="header-nav-item">
            Gallerie
          </a>
          <a href="/artists" className="header-nav-item">
            Artistes
          </a>
          <a href="/checkout" className="panier-logo">
            <img
              src="https://previews.123rf.com/images/jongjet303/jongjet3031703/jongjet303170300058/73541589-aperçu-de-l-icône-du-panier-icône-pour-la-conception-du-site-web-logo.jpg"
              alt=""
            />
            <p>({itemsCount})</p>
          </a>
        </div>
        <div className="header-user">
          {user ? (
            <ul>
              <li className="header-user-item">
                <a>{user}</a>
              </li>
              <li className="header-user-item">
                <a
                  href="/"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleLogout()}
                >
                  Se déconnecter
                </a>
              </li>
            </ul>
          ) : (
            <ul>
              <li className="header-user-item">
                <a href="/sign-up">S'inscrire</a>
              </li>
              <li className="header-user-item">
                <a href="/login">Se connecter</a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

import React from "react";
import "./header.scss";

export const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img
            className="header-logo-img"
            src="https://static.vecteezy.com/system/resources/previews/007/186/959/original/paint-logo-full-color-luxury-design-style-creative-brush-concept-free-vector.jpg"
          ></img>
          <h2 className="header-logo-text">MyArt</h2>
        </div>
        <div className="header-nav">
          <a className="header-nav-item">Gallerie</a>
          <a className="header-nav-item">Artistes</a>
          <a className="header-nav-item">Boutique</a>
          <a className="panier-logo">
            <img
              src="https://previews.123rf.com/images/jongjet303/jongjet3031703/jongjet303170300058/73541589-aperçu-de-l-icône-du-panier-icône-pour-la-conception-du-site-web-logo.jpg"
              alt=""
            />
          </a>
        </div>
        <div className="header-user">
          <ul>
            <li className="header-user-item">S'inscrire</li>
            <li className="header-user-item">Se connecter</li>
          </ul>
        </div>
      </div>
    </header>
  );
};

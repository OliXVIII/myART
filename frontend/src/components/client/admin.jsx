import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { getCommande } from "../../utils/get-commande";
import "./checkout.scss";

export const Checkout = () => {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    setCommandes(getCommande());
  }, []);

  return (
    <div className="checkout">
      <h1>Page de paiement</h1>
      {cartItems.map((art, index) => (
        <div key={index} className="checkout-item">
          <div className="checkout-item-left">
            <img src={art.image_url}></img>
            <p>
              {art.nom} - ${art.prix}
            </p>
          </div>
          <button onClick={() => handleRemoveFromCart(art)}>
            Supprimer l'article
          </button>
        </div>
      ))}
    </div>
  );
};

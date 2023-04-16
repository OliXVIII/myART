import React, { useEffect, useState } from "react";
import "./checkout.scss";

function removeItemFromLocalStorage(itemId) {
  const items = JSON.parse(localStorage.getItem("myArt_items")) || [];
  const updatedItems = items.filter((item) => item.id !== itemId);
  localStorage.setItem("myArt_items", JSON.stringify(updatedItems));
}

export const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productIds, setProductIds] = useState([]);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const items = JSON.parse(localStorage.getItem("myArt_items")) || [];
    setCartItems(items);
    if (items) setProductIds(items.map((art) => art.id));
  };

  const handleRemoveFromCart = (item) => {
    removeItemFromLocalStorage(item.id);
    loadCartItems();
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`http://localhost:5000/arts`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productIds),
      });
      console.log(response);
      if (response.ok) {
        console.log("Paid successfully");
        localStorage.removeItem("myArt_items");
        setCartItems([]);
      } else {
        console.log("Error in paiement client");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
      {cartItems.length === 0 && <p>Votre panier est vide</p>}
      {cartItems.length === 0 ? (
        <a href="/" className="checkout-button button">
          Voir les articles disponibles
        </a>
      ) : (
        <button onClick={() => handleCheckout()} className="checkout-button">
          Payer avec des jetons magiques
        </button>
      )}
    </div>
  );
};

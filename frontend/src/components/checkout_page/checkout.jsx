import React, { useEffect, useState } from 'react';
import './checkout.scss';

function removeItemFromLocalStorage(itemId) {
  const items = JSON.parse(localStorage.getItem("myArt_items")) || [];
  const updatedItems = items.filter((item) => item.id !== itemId);
  localStorage.setItem("myArt_items", JSON.stringify(updatedItems));
}

export const Checkout= () => {
  const [cartItems, setCartItems] = useState([]);



  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const items = JSON.parse(localStorage.getItem("myArt_items")) || [];
    setCartItems(items);
  };

  const handleRemoveFromCart = (item) => {
    removeItemFromLocalStorage(item.id);
    loadCartItems();
  };
  return (
    <div className='checkout'>
      <h1>Page de paiement</h1>
        {cartItems.map((art, index) => (
          <div key={index} className='checkout-item'><div className='checkout-item-left'><img src={art.image_url}></img><p>{art.nom} - ${art.prix}</p></div><button onClick={() => handleRemoveFromCart(art)}>Supprimer l'article</button></div>
        ))}
        <button className='checkout-button'>Payer</button>
    </div>
  );
}

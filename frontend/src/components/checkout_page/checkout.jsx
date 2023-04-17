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
  const [adresseForm,setAdresseForm] = useState({
    pays:"",
    code_postale:"",

  });
  const [adresseAdded, setAdresseAdded] = useState(false);
  const [adresseId, setAdresseId] = useState(null);
  const [adresseMessage, setAdresseMessage] = useState("");



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
        handleCreateCommande();
        localStorage.removeItem("myArt_items");
        setCartItems([]);
      } else {
        console.log("Error in paiement client");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAdresseChange = (event) => {
    const { name, value } = event.target;
    setAdresseForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

   const handleCreateAdresse = async () => {
   try {
    const response = await fetch(`http://localhost:5000/adresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adresseForm),
    });

    if (response.ok) {
      const adresse = await response.json();
      console.log("Adresse créée avec succès :", adresse);
      setAdresseMessage("Adresse ajoutée avec succès !");
      setAdresseAdded(true);
      setAdresseId(adresse.id);
    } else {
      console.log("Erreur lors de la création de l'adresse");
      setAdresseMessage("Erreur lors de l'ajout de l'adresse.");
    }
  } catch (error) {
    console.error("Erreur:", error);
    setAdresseMessage("Erreur lors de l'ajout de l'adresse.");
  }
  };
   const handleCreateCommande = async () => {
  try {
    const clientId = localStorage.getItem("userid");
    if (!clientId) {
      console.log("Erreur: Aucun utilisateur connecté");
      return;
    }

    const response = await fetch(`http://localhost:5000/commandes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        adresse_id: adresseId,
        statut: "En attente",
      }),
    });

    if (response.ok) {
      console.log("Commande créée avec succès");
    } else {
      console.log("Erreur lors de la création de la commande");
    }
  } catch (error) {
    console.error("Erreur:", error);
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
      {!adresseAdded &&(
      <div className="adresse-form">
        <h2>Ajouter une adresse</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="pays"
            value={adresseForm.pays}
            onChange={handleAdresseChange}
            placeholder="Pays"
            required
          />
          <input
            type="text"
            name="code_postale"
            value={adresseForm.code_postale}
            onChange={handleAdresseChange}
            placeholder="Code postal"
            required
          />
          <input
            type="text"
            name="ville"
            value={adresseForm.ville}
            onChange={handleAdresseChange}
            placeholder="Ville"
            required
          />
          <input
            type="text"
            name="rue"
            value={adresseForm.rue}
            onChange={handleAdresseChange}
            placeholder="Rue"
            required
          />
          <input
            type="number"
            name="numero_porte"
            value={adresseForm.numero_porte}
            onChange={handleAdresseChange}
            placeholder="Numéro de porte"
          />
          <button onClick={handleCreateAdresse}>Ajouter une adresse</button>
        </form>
      </div>
      )}
    </div>
  );
};

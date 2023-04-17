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
    ville:""
  });
  const [adresseAdded, setAdresseAdded] = useState(false);
  const [adresseId, setAdresseId] = useState(null);
  const [adresseMessage, setAdresseMessage] = useState("");
  const [paiementAvecLivraison, setPaiementAvecLivraison] = useState(false);



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
     if (modePaiement === "magasin") {
      handleCreateCommande(null);
      localStorage.removeItem("myArt_items");
      setCartItems([]);
    } else if (modePaiement === "livraison") {
      handleCreateAdresse();
    } else {
      console.log("Veuillez choisir un mode de paiement");
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

   const handlePayInStore = () => {
     removeItemFromLocalStorage(null); // Pass null as itemId to remove all items
     setCartItems([]);
     window.location.href = '/';
   }

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
      <div>
        <button onClick={() => handlePayInStore()} className="checkout-button">
          Payer en magasin
        </button>
        <button onClick={() => handlePaymentWithDelivery()} className="checkout-button">
          Paiement avec livraison
        </button>
      </div>
    )}
    {!adresseAdded && (
      <div className="adresse-form">
        <h2>Ajouter une adresse</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            name="pays"
            placeholder="Pays"
            value={adresseForm.pays}
            onChange={handleAdresseChange}
          />
          <input
            type="text"
            name="code_postale"
            placeholder="Code postal"
            value={adresseForm.code_postale}
            onChange={handleAdresseChange}
          />
          <input
            type="text"
            name="ville"
            placeholder="Ville"
            value={adresseForm.ville}
            onChange={handleAdresseChange}
          />
          <button onClick={() => handleCreateAdresse()}>Confirmer</button>
        </form>
        {adresseMessage && <p>{adresseMessage}</p>}
      </div>
    )}
  </div>
  );
};

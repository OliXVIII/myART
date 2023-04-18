import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { handleSell } from "../../utils/se-product";
import "./checkout.scss";

function removeItemFromLocalStorage(itemId) {
  const items = JSON.parse(localStorage.getItem("myArt_items")) || [];
  const updatedItems = items.filter((item) => item.id !== itemId);
  localStorage.setItem("myArt_items", JSON.stringify(updatedItems));
}

export const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [adresseForm, setAdresseForm] = useState({
    pays: "",
    code_postale: "",
    ville: "",
    rue: "",
    numero_porte: "",
  });
  const [adresseAdded, setAdresseAdded] = useState(false);
  const [adresseId, setAdresseId] = useState(null);
  const [adresseMessage, setAdresseMessage] = useState("");
  const [paiementAvecLivraison, setPaiementAvecLivraison] = useState(false);
  const { client_id } = useContext(UserContext);
  const [showAdresseForm, setShowAdresseForm] = useState(false);
  const [showConfirmationButton, setShowConfirmationButton] = useState(false);

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

  const handleAdresseChange = (event) => {
    const { name, value } = event.target;
    const pattern = /^(\d+)\s+(.*)/;
    if (name === "rue" && value.match(pattern)) {
      const match = value.match(pattern);
      setAdresseForm((prevState) => ({
        ...prevState,
        rue: match[2],
        numero_porte: match[1],
      }));
    } else {
      setAdresseForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCreateAdresse = async () => {
    let adresseId = await searchAdresse(adresseForm);
    if (!adresseId) {
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
          adresseId = adresse.id;
        } else {
          console.log("Erreur lors de la création de l'adresse");
          setAdresseMessage("Erreur lors de l'ajout de l'adresse.");
        }
      } catch (error) {
        console.error("Erreur:", error);
        setAdresseMessage("Erreur lors de l'ajout de l'adresse.");
      }
    } else {
      console.log("Adresse existante trouvée, ID :", adresseId);
      setAdresseMessage("Adresse existante trouvée !");
    }
    setAdresseAdded(true);
    setAdresseId(adresseId);
    setShowAdresseForm(false);
    setShowConfirmationButton(true);
  };
  const handleCreateCommande = async (adresseId = null) => {
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
        const errorData = await response.json();
        console.log("Erreur lors de la création de la commande", errorData);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handlePayInStore = async () => {
    handleCreateCommande(null);
    await handleSell(cartItems);
    localStorage.setItem("myArt_items", JSON.stringify([]));
    setCartItems([]);
    window.location.href = "/";
  };
  const handleConfirmOrder = async () => {
    if (adresseId) {
      handleCreateCommande(adresseId);
      await handleSell(cartItems);
      localStorage.removeItem("myArt_items");
      setCartItems([]);
    } else {
      console.log("Veuillez ajouter une adresse");
    }
  };
  const handlePaymentWithDelivery = () => {
    setPaiementAvecLivraison(true);
    setShowAdresseForm(true);
  };
  const searchAdresse = async (adresse) => {
    try {
      // Convertir l'objet adresse en une chaîne de requête
      const queryString = Object.keys(adresse)
        .map((key) => `${key}=${encodeURIComponent(adresse[key])}`)
        .join('&');
  
      const response = await fetch(`http://localhost:5000/adresses/search?${queryString}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Response status:", response.status);
      console.log("Response object:", response);
      if (response.ok) {
        const result = await response.json();
        if (result.length > 0) {
          return result[0].id; // Retourne l'ID de la première adresse trouvée
        }
    } catch (error) {
      console.error("Erreur lors de la recherche de l'adresse:", error);
    }
    return null;
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
        <>
          {!paiementAvecLivraison && (
            <div>
              <button
                onClick={() => handlePayInStore()}
                className="checkout-button"
              >
                Payer en magasin
              </button>
              <button
                onClick={() => handlePaymentWithDelivery()}
                className="checkout-button"
              >
                Paiement avec livraison
              </button>
            </div>
          )}
          {showAdresseForm && (
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
                <input
                  type="text"
                  name="rue"
                  placeholder="Rue"
                  value={adresseForm.rue}
                  onChange={handleAdresseChange}
                />
                <button onClick={() => handleCreateAdresse()}>Confirmer</button>
              </form>
              {adresseMessage && <p>{adresseMessage}</p>}
            </div>
          )}
          {showConfirmationButton && (
            <button
              onClick={() => handleConfirmOrder()}
              className="checkout-button"
            >
              Confirmer la commande
            </button>
          )}
        </>
      )}
    </div>
  );
};

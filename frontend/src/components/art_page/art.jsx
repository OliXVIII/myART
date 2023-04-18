import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./art.scss";
import { handleDelete } from "../../utils/delete-product";

const getArt = async () => {
  const artId = window.location.pathname.split("/")[2];
  const art = await fetch(
    `http://localhost:5000/art/${artId}?includeCategory=true`
  );
  if (art.ok) {
    const data = await art.json();
    return data;
  } else {
    throw new Error(`Error retrieving data: ${art.status} ${art.statusText}`);
  }
};

const addItemToLocalStorage = (item) => {
  const items = JSON.parse(localStorage.getItem("myArt_items")) || [];
  if (!items.find((i) => i.id === item.id)) {
    items.push(item);
    localStorage.setItem("myArt_items", JSON.stringify(items));
  }
};

export const Art = () => {
  let { state } = useLocation();
  const [art, setArt] = useState(state.art || null);
  useEffect(() => {
    if (state.art) {
      const fetchArts = async () => {
        try {
          const data = await getArt();
          setArt(data);
        } catch (error) {
          console.error(error);
        }
      };
      fetchArts();
    }
  }, []);

  const handleAddToCart = () => {
    addItemToLocalStorage(art);
  };

  const handleAdmin = async (art) => {
    await handleDelete([art]);
    window.location.href = "/";
  };

  return (
    <div className="art-page">
      <h1 className="art-title">{art.nom}</h1>
      <div className="art__image">
        <img src={art.image_url} alt={art.title} />
      </div>
      <div className="art__info">
        <p>{art.description}</p>
        <p>Mouvements artistiques: {art.categorie_nom}</p>
        <p>Description de la catégorie: {art.categorie_description}</p>
        <p>Examplaire: {art.quantite}</p>
        <p>Prix: {art.prix}</p>
        <p>
          Artiste:{" "}
          <a className="artist-link" href={`/artist/${art.artiste_id}`}>
            {art["a.nom"]}
          </a>
        </p>
        {localStorage.getItem("userData") == "admin" && (
          <button onClick={() => handleAdmin(art)}>Delete art (admin)</button>
        )}
        {art.quantite > 0 ? (
          <a
            onClick={handleAddToCart}
            className="art-acheter button"
            href="/checkout"
          >
            Acheter
          </a>
        ) : (
          <a
            style={{ backgroundColor: "lightpink" }}
            className="art-acheter button"
            href="/"
          >
            Vendu
          </a>
        )}
      </div>
    </div>
  );
};

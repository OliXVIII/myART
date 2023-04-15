import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./art.scss";

const getArt = async () => {
  const artId = window.location.pathname.split("/")[2];
  const art = await fetch(`http://localhost:5000/art/${artId}?includeCategory=true`);
  if (art.ok) {
    const data = await art.json();
    console.log(data);
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

  return (
    <div className="art-page">
      <h1 className="art-title">{art.nom}</h1>
      <div className="art__image">
        <img src={art.image_url} alt={art.title} />
      </div>
      <div className="art__info">
        <p>{art.description}</p>
        <p>Catégorie: {art.categorie_nom}</p>
        <p>Description de la catégorie: {art.categorie_description}</p>
        <p>Examplaire: {art.quantite}</p>
        <p>Prix: {art.prix}</p>
        <p>Mouvements artistiques: {art["c.nom"]}</p>
        <p>
          Artiste:{" "}
          <a className="artist-link" href={`/artist/${art.artiste_id}`}>
            {art["a.nom"]}
          </a>
        </p>
        <a
          onClick={handleAddToCart}
          className="art-acheter button"
          href="/checkout"
        >
          Acheter
        </a>
      </div>
    </div>
  );
};

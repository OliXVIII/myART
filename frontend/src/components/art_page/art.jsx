import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./art.scss";

const getArt = async () => {
  const artId = window.location.pathname.split("/")[2];
  const art = await fetch(`http://localhost:5000/art/${artId}`);
  if (art.ok) {
    const data = await art.json();
    console.log(data)
    return data;
  } else {
    throw new Error(`Error retrieving data: ${art.status} ${art.statusText}`);
  }
};


export const Art = () => {
  let { state } = useLocation();
  const [art, setArt] = useState(state.art || null);
  useEffect(() => {
    if (!state.art) {
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

  return (
    <div className="art">
      <h1 className="art-title">{art.nom}</h1>
      <div className="art__image">
        <img src={art.image_url} alt={art.title} />
      </div>
      <div className="art__info">
        
        <p>{art.description}</p>
        <p>Examplaire: {art.quantite}</p>
        <div className="art__info__price">
          <p>Prix: {art.prix}</p>
        </div>
        <a className="art-acheter" href="/checkout">Acheter</a>
      </div>
    </div>
  );
}

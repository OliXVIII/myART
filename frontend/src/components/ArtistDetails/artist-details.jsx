import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./artist-details.scss";

const ArtistDetails = () => {
  const [artist, setArtist] = useState(null);
  const [products, setProducts] = useState([]); // [
  const { id } = useParams();

  useEffect(() => {
    const fetchArts = async () => {
      try {
        fetch(`http://localhost:5000/artist/${id}`)
          .then((response) => response.json())
          .then((data) => {
            setArtist(data[0]);
            setProducts(data);
          });
      } catch (error) {
        console.error(error);
      }
    };
    fetchArts();
  }, [id]);

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="artist-details">
      <h1>{artist.nom}</h1>
      <p>Nationalité : {artist.nationalite}</p>
      <p>Année de naissance : {artist.anneeDeNaissance}</p>
      <p>Bibliographie :</p>
      <p>{artist.bibliographie}</p>
      <h2>Oeuvre d'art fait par {artist.nom}</h2>
      <div className="artist-details-list">
        {products.map((product, i) => (
          <div key={i}>
            <a href={`/art/${product["p.id"]}`}>{product["p.nom"]}</a>
            <img src={product.image_url}></img>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ArtistDetails };

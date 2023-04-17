import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ paddingRight: "3%", width: "50%" }}>
          <img className="image-artist" src={artist.url_img}></img>
        </div>
        <div>
          <h1>{artist.nom}</h1>
          <p>Nationalité : {artist.nationalite}</p>
          <p>Année de naissance : {artist.anneeDeNaissance}</p>
          <p>Bibliographie :</p>
          <p>{artist.bibliographie}</p>
        </div>
      </div>
      <h2>Oeuvre d'art fait par {artist.nom}</h2>
      <div className="artist-details-list">
        {products.map((product, i) => (
          <div key={i}>
            <Link to={`/art/${product["p.id"]}`} state={{ art: product }}>
              {product["p.nom"]}
            </Link>
            <img src={product.image_url}></img>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ArtistDetails };

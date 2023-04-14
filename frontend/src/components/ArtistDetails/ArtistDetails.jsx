import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const ArtistDetails = () => {
  const [artist, setArtist] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchArts = async () => {
      try {
        fetch(`http://localhost:5000/artist/${id}`)
          .then((response) => response.json())
          .then((data) => setArtist(data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchArts();
  }, [id]);

  if (!artist) {
    return <div>Loading...</div>;
  }
  console.log(artist);

  return (
    <div>
      <h1>{artist.nom}</h1>
      <p>Nationalité : {artist.nationalite}</p>
      <p>Année de naissance : {artist.anneeDeNaissance}</p>
      <p>Bibliographie :</p>
      <pre>{artist.bibliographie}</pre>
    </div>
  );
};

export { ArtistDetails };

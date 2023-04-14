import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./artist.scss";
const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/artists")
      .then((response) => response.json())
      .then((data) => setArtists(data));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredArtists = artists.filter((artist) =>
    artist.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="artist">
      <h1>Liste des artistes</h1>
      <input
        type="text"
        placeholder="Rechercher un artiste"
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {filteredArtists.map((artist) => (
          <li key={artist.id}>
            <Link to={`/artist/${artist.id}`} state={{ artist: artist }}>
              {artist.nom} - {artist.nb_produits} produit(s)
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Artists };

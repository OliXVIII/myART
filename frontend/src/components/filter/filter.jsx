import React, {useEffect, useState} from "react";
import { get_categories, get_artistes } from "./filter.py";

// Utilisez les fonctions pour obtenir les variables souhaitées
const categories = get_categories();
const artistes = get_artistes();

export function Filter() {
  const [artists, setArtists] = useState([]);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
      setArtists(artistes);
      setArtworks(categories);
  }, []);

  return (
    <div className="filter-section">
      <div className="filter-group">
        <label htmlFor="artist-filter">Artiste</label>
        <select id="artist-filter">
          {artists.map((artist) => (
            <option key={artist.artist} value={artist.artist}>
              {artist.artist}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="artwork-filter">Oeuvre d'art</label>
        <select id="artwork-filter">
          {artworks.map((artwork) => (
            <option key={artwork.artwork} value={artwork.artwork}>
              {artwork.artwork}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

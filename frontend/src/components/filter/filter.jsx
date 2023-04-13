import React, { useState, useEffect } from "react";
import { categories, artistes } from '/Applications/photopython/UL/Session/H23/SQL/Projet/myART/frontend/src/components/filter/filter.py'

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

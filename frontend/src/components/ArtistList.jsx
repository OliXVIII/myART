import React, { useState, useEffect } from 'react';

function ArtistList() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch('/api/arts')
      .then(response => response.json())
      .then(data => {
        setArtists(data);
      });
  }, []);

  return (
    <div>
      <h1>Liste des artistes</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.nom}</li>
        ))}
      </ul>
    </div>
  );
}

export default ArtistList;


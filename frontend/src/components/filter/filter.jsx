import React, { useState, useEffect } from "react";
import "./filter.scss";

export const Filter = ({ categories, setCategorie }) => {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="filtre">
      <button onClick={() => setShowCategories(!showCategories)}>
        Voir les categories
      </button>
      {showCategories && (
        <ul className="filtre-list">
          {categories.map((categorie, i) => (
            <li onClick={() => setCategorie(categorie.id)} key={i}>
              {categorie.nom}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Filter;

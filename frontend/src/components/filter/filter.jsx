import React, { useState, useEffect } from "react";
import "./filter.scss";

const getArtistes = async () => {
  const artistes = await fetch("http://127.0.0.1:5000/dist_artistes");
  if (artistes.ok) {
    const data = await artistes.json();
    return data; // return an array of the fetched data
  } else {
    throw new Error(
      `Error retrieving data: ${artistes.status} ${artistes.statusText}`
    );
  }
};
const getCategorie = async () => {
  const categories = await fetch("http://127.0.0.1:5000/dist_categories");
  if (categories.ok) {
    const data = await categories.json();
    return data; // return an array of the fetched data
  } else {
    throw new Error(
      `Error retrieving data: ${categories.status} ${categories.statusText}`
    );
  }
};

export const Filter = () => {
  const [artistes, setArtistes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getArtistes(); // destructure the returned array
        //const dataC = await getCategorie();
        setArtistes(data);
        //setCategories(dataC);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="filtre">
      <ul className="objet-fitre">
        {artistes.map((artiste) => (
          <li key={artiste.id}>{artiste.name}</li>
        ))}
      </ul>
      <ul className="objet-fitre">
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Filter;

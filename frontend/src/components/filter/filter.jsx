import React, { useState, useEffect } from "react";
import "./filter.scss";

const getAPI = async () => {
  const artistes = await fetch("http://127.0.0.1:5000/dist_artistes");
  const categories = await fetch("http://127.0.0.1:5000/dist_categories");
  if (artistes.ok && categories.ok) {
    const data = await artistes.json();
    const dataC = await categories.json();
    console.log(data, dataC);
    return [data, dataC]; // return an array of the fetched data
  } else {
    throw new Error(`Error retrieving data: ${artistes.status} ${artistes.statusText} or ${categories.status} ${categories.statusText}`);
  }
};

export const Filter = () => {
  const [artistes, setArtistes] = useState([]);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, dataC] = await getAPI(); // destructure the returned array
        setArtistes(data);
        setCategories(dataC);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="filtre">
      <ul className="objet-fitre">
        Artistes
        {artistes.map((artiste) => (
          <li key={artiste.id}>{artiste.name}</li>
        ))}
      </ul>
      <ul className="objet-fitre">
        Categories
        {categories.map((category) => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Filter;
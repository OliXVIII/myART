import { useEffect, useState, Fragment } from "react";
import "./homepage.scss";
import { Link } from "react-router-dom";
import Filter from "../filter/filter";

const getAPI = async (categorie) => {
  const queryParams = new URLSearchParams({
    categorie_id: categorie,
  });
  const arts = await fetch(
    `http://localhost:5000/arts?${queryParams.toString()}`
  );
  if (arts.ok) {
    const data = await arts.json();
    return data;
  } else {
    throw new Error(`Error retrieving data: ${arts.status} ${arts.statusText}`);
  }
};

export const Homepage = () => {
  const [arts, setArts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categorie, setCategorie] = useState("");

  useEffect(() => {
    const fetchArts = async () => {
      try {
        const data = await getAPI(categorie);
        setArts(data.arts);
        setCategories(data.categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchArts();
  }, [categorie]);

  return (
    <div className="homepage">
      <Filter categories={categories} setCategorie={setCategorie} />
      {arts.map((art, i) => (
        <div className={i % 2 ? "art" : "art art-impair"} key={art.id}>
          <img className="art-image" src={art.image_url} alt={art.nom} />
          <div className="art-info">
            <h2>{art.nom}</h2>
            <p>{art.description}</p>
            <Link
              className="learn-more button"
              to={{ pathname: `/art/${art.id}` }}
              state={{ art: art }}
            >
              Découvrez cet article
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

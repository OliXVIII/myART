import { useEffect, useState, Fragment} from "react";
import "./homepage.scss";
import { Link } from "react-router-dom";
import Filter from "../filter/filter";

const getAPI = async () => {
  const arts = await fetch("http://127.0.0.1:5000/arts");
  if (arts.ok) {
    const data = await arts.json();
    console.log(data);
    return data;
  } else {
    throw new Error(`Error retrieving data: ${arts.status} ${arts.statusText}`);
  }
};

export const Homepage = () => {
  const [arts, setArts] = useState([]);
  useEffect(() => {
    const fetchArts = async () => {
      try {
        const data = await getAPI();
        setArts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchArts();
  }, []);

  return (
    <Fragment>
      <Filter />
      <div className="homepage">
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
    </Fragment>
  );
}

import { useEffect, useState } from 'react';
import './homepage.scss';
import { Link } from 'react-router-dom';

const getAPI = async () => {
  const arts = await fetch('http://localhost:5000/arts');
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
    <div className="homepage">
      {arts.map((art, i) => (
        <div className={(i % 2) ? 'art' : 'art art-impair'} key={art.id}>
          <img className='art-image' src={art.image_url} alt={art.nom} />
          <div className="art-info">
            <h2>{art.nom}</h2>
            <p>{art.description}</p>
            <Link className='learn-more' to={{pathname: `/art/${art.id}`}} state={{art: art}}>Découvrez cet article</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
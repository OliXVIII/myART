import { useEffect, useState } from 'react';
import './homepage.scss';

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
        <div className={'art ' + i % 2 ? '' : 'art-impair'} key={art.id}>
          <img src={art.image} alt={art.title} />
          <div className="art-info">
            <h3>{art.title}</h3>
            <p>{art.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
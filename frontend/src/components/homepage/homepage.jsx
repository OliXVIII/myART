import './homepage.scss';

const getAPI = async () => {
  const arts = await fetch('http://localhost:5000/arts');
  if (arts.ok) {
    const data = await arts.json();
  }
};

export const Homepage = () => {
  const arts = [];//getAPI();

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
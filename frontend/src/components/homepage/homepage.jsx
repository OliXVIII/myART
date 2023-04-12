import './homepage.scss';

export const Homepage = () => {
  const arts = await fetch('http://localhost:5000/arts');
  if (arts.ok) {
    const data = await arts.json();
  }

  return (
    <div className="homepage">
      {data.map((art) => (
        <div className="art" key={art.id}>
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
import React, { useContext, useState } from "react";
import { UserContext } from "../../UserContext";

const Login = () => {
  const { setClientID } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "",
    mot_de_passe: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (error) {
      setError(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Connexion réussie");
        console.log("Data:", data);
        localStorage.setItem("userData", data[1]);
        localStorage.setItem("userid", data[0]);
        setClientID(data[0]);
        window.location.href = "/";
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Page de connexion</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          required
        />
        <br />
        <label htmlFor="mot_de_passe">Mot de passe :</label>
        <input
          type="password"
          id="mot_de_passe"
          name="mot_de_passe"
          value={formData.mot_de_passe}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          required
        />
        <br />
        <button type="submit">Se connecter</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
};

export { Login };

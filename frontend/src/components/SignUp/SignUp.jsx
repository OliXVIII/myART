import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    mot_de_passe: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Client registered successfully");
        localStorage.setItem("userData", formData.nom);
        localStorage.setItem("userid", response.id);
        window.location.href = "/";
      } else {
        if (response == "Email already exists") {
          setError("Email already exists");
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  if (error == "Email already exists") {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Page d'inscription</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nom">Nom:</label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="mot_de_passe">Mot de passe:</label>
        <input
          type="password"
          id="mot_de_passe"
          name="mot_de_passe"
          value={formData.mot_de_passe}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export { SignUp };

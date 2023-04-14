import React, { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    mot_de_passe: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  // Send form data to your backend
  try {
    const response = await fetch('http://localhost:5000/clients', { // Update the endpoint here
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      console.log('Client registered successfully');
      // Redirect or show success message
    } else {
      console.log('Error registering client');
      // Show error message or handle error
    }
  } catch (error) {
    console.error('Error:', error);
    // Show error message or handle error
  }
};

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


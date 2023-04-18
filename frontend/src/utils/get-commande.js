export const getCommande = async () => {
  try {
    let productIds = [];
    if (items) {
      productIds = items.map((art) => art.id);
    }
    const response = await fetch(`http://localhost:5000/commandes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await arts.json();
      return data;
    
  } catch (error) {
    console.error("Error:", error);
  }
};

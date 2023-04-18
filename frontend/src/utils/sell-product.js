export const handleSell = async (items) => {
  try {
    let productIds = [];
    if (items) {
      productIds = items.map((art) => art.id);
    }
    const response = await fetch(`http://localhost:5000/arts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productIds),
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

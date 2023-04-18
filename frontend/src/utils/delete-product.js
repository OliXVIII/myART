export const handleDelete = async (items) => {
  try {
    let productIds = [];
    if (items) {
      productIds = items.map((art) => art.id);
    }
    const response = await fetch(`http://localhost:5000/arts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productIds),
    });
    console.log("response");
    if (response.ok) {
      console.log("Paid successfully");
    } else {
      console.log("Error in paiement client");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

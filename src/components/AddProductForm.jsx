import { useState } from "react";

function AddProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    reorder_level: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.category ||
      formData.quantity === "" ||
      formData.price === "" ||
      formData.reorder_level === ""
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (
      Number(formData.quantity) < 0 ||
      Number(formData.price) < 0 ||
      Number(formData.reorder_level) < 0
    ) {
      setError("Quantity, price, and reorder level cannot be negative.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            quantity: Number(formData.quantity),
            price: Number(formData.price),
            reorder_level: Number(formData.reorder_level),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to add product"
        );
      }

      setSuccess(
        `${data.name} was added successfully.`
      );

      setFormData({
        name: "",
        category: "",
        quantity: "",
        price: "",
        reorder_level: "",
      });

      if (onProductAdded) {
        onProductAdded(data);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="section-header">
        <h2>Add New Product</h2>
        <span>Inventory management</span>
      </div>

      <form
        className="add-product-form"
        onSubmit={handleSubmit}
      >

        <div className="form-group">
          <label htmlFor="name">
            Product Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder=" Eg: Dell Monitor 24"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category
          </label>

          <input
            id="category"
            name="category"
            type="text"
            placeholder=" Eg: Electronics"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">
            Quantity
          </label>

          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            placeholder=" Eg: 20"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">
            Price
          </label>

          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder=" Eg: 12999"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reorder_level">
            Reorder Level
          </label>

          <input
            id="reorder_level"
            name="reorder_level"
            type="number"
            min="0"
            placeholder=" Eg: 5"
            value={formData.reorder_level}
            onChange={handleChange}
          />
        </div>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        {success && (
          <p className="form-success">
            {success}
          </p>
        )}

        <button
          type="submit"
          className="add-product-button"
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default AddProductForm;
function ProductTable({ products, onDelete }) {
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      onDelete(id);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Minimum Stock</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            let status = "Healthy";

            if (product.quantity === 0) {
              status = "Out of Stock";
            } else if (product.quantity <= product.reorder_level) {
              status = "Low Stock";
            }

            return (
              <tr key={product.id}>
                <td>#{product.id}</td>

                <td>{product.name}</td>

                <td>{product.category}</td>

                <td>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </td>

                <td>{product.quantity}</td>

                <td>{product.reorder_level}</td>

                <td>
                  <span
                    className={`status ${status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {status}
                  </span>
                </td>

                <td>
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(product.id, product.name)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
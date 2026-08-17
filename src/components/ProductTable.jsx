function ProductTable({ products }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Minimum Stock</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            let status = "Healthy";

            if (product.stock === 0) {
              status = "Out of Stock";
            } else if (product.stock <= product.minimumStock) {
              status = "Low Stock";
            }

            return (
              <tr key={product.id}>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price.toLocaleString()}</td>
                <td>{product.minimumStock}</td>

                <td>
                  <span
                    className={`status ${status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {status}
                  </span>
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
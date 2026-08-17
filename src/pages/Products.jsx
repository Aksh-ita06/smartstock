import { Plus, Search } from "lucide-react";
import ProductTable from "../components/ProductTable";

function Products() {
  const products = [
    {
      id: 1,
      sku: "LAP001",
      name: "Laptop",
      category: "Electronics",
      price: 60000,
      stock: 23,
      minimumStock: 10,
    },
    {
      id: 2,
      sku: "MOU001",
      name: "Wireless Mouse",
      category: "Accessories",
      price: 800,
      stock: 7,
      minimumStock: 15,
    },
    {
      id: 3,
      sku: "KEY001",
      name: "Keyboard",
      category: "Accessories",
      price: 1200,
      stock: 56,
      minimumStock: 20,
    },
    {
      id: 4,
      sku: "MON001",
      name: "Monitor",
      category: "Electronics",
      price: 15000,
      stock: 0,
      minimumStock: 5,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your inventory products.</p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search products..."
        />

        <select>
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Accessories</option>
        </select>
      </div>

      <ProductTable products={products} />
    </div>
  );
}

export default Products;
import { useEffect, useState } from "react";
import {
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import StatCard from "../components/StatCard";
import RecommendationCard from "../components/RecommendationCard";
import TransactionTable from "../components/TransactionTable";
import AddProductForm from "../components/AddProductForm";
import Analytics from "../components/Analytics";

function Dashboard() {
  // =========================
  // PRODUCTS
  // =========================

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // TRANSACTIONS
  // =========================

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] =
    useState(true);

  // =========================
  // RECOMMENDATIONS
  // =========================

  const [recommendations, setRecommendations] =
    useState([]);

  const [recommendationsLoading, setRecommendationsLoading] =
    useState(true);

  // =========================
  // SEARCH & FILTERS
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("ALL");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  // =========================
  // EDIT PRODUCT
  // =========================

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    reorder_level: "",
  });

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data = await response.json();

      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching products:",
        error
      );

      setLoading(false);
    }
  };

  // =========================
  // FETCH TRANSACTIONS
  // =========================

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch transactions"
        );
      }

      const data = await response.json();

      setTransactions(data);
      setTransactionsLoading(false);
    } catch (error) {
      console.error(
        "Error fetching transactions:",
        error
      );

      setTransactionsLoading(false);
    }
  };

  // =========================
  // FETCH RECOMMENDATIONS
  // =========================

const fetchRecommendations = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/forecast"
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch forecast"
      );
    }

    const data = await response.json();

    console.log("Forecast data:", data);

    setRecommendations(data);
    setRecommendationsLoading(false);

  } catch (error) {

    console.error(
      "Recommendations error:",
      error
    );

    setRecommendations([]);
    setRecommendationsLoading(false);
  }
};

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
    fetchRecommendations();
  }, []);

  // =========================
  // ADD PRODUCT
  // =========================

  const handleProductAdded = (newProduct) => {
    setProducts((previousProducts) => [
      ...previousProducts,
      newProduct,
    ]);
  };

  // =========================
  // DASHBOARD CALCULATIONS
  // =========================

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.quantity),
    0
  );

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.quantity) > 0 &&
      Number(product.quantity) <=
        Number(product.reorder_level)
  );

  const lowStock = lowStockProducts.length;

  const outOfStock = products.filter(
    (product) =>
      Number(product.quantity) === 0
  ).length;

  // =========================
  // MAX STOCK
  // =========================

  const maxStock = Math.max(
    ...products.map((product) =>
      Number(product.quantity)
    ),
    1
  );

  // =========================
  // EDIT PRODUCT
  // =========================

  const handleEditClick = (product) => {
    setEditingProduct(product);

    setEditForm({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      reorder_level: product.reorder_level,
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editForm.name,
            category: editForm.category,
            quantity: Number(
              editForm.quantity
            ),
            price: Number(editForm.price),
            reorder_level: Number(
              editForm.reorder_level
            ),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update product"
        );
      }

      const data = await response.json();

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProduct.id
            ? data.product
            : product
        )
      );

      setEditingProduct(null);

      fetchTransactions();
      fetchRecommendations();
    } catch (error) {
      console.error(
        "Error updating product:",
        error
      );

      alert(
        "Failed to update product."
      );
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct = async (
    product
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${product.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete product"
        );
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) =>
            item.id !== product.id
        )
      );

      fetchTransactions();
      fetchRecommendations();
    } catch (error) {
      console.error(
        "Error deleting product:",
        error
      );

      alert(
        "Failed to delete product."
      );
    }
  };

  // =========================
  // SEARCH & FILTER
  // =========================

  const categories = [
    ...new Set(
      products.map(
        (product) => product.category
      )
    ),
  ];

  const filteredProducts =
    products.filter((product) => {
      const quantity = Number(
        product.quantity
      );

      const reorderLevel = Number(
        product.reorder_level
      );

      // SEARCH
      const searchValue =
        searchTerm.toLowerCase();

      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(searchValue) ||
        product.category
          .toLowerCase()
          .includes(searchValue);

      // CATEGORY
      const matchesCategory =
        categoryFilter === "ALL" ||
        product.category ===
          categoryFilter;

      // STATUS
      let status = "HEALTHY";

      if (quantity === 0) {
        status = "OUT_OF_STOCK";
      } else if (
        quantity <= reorderLevel
      ) {
        status = "LOW_STOCK";
      }

      const matchesStatus =
        statusFilter === "ALL" ||
        status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });

  // =========================
  // RESTOCK PRODUCT
  // =========================

  const handleRestock = async (
    productId,
    quantity
  ) => {
    const restockQuantity =
      Number(quantity);

    if (
      !restockQuantity ||
      restockQuantity <= 0
    ) {
      alert(
        "Invalid restock quantity."
      );
      return;
    }

    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) {
      alert("Product not found.");
      return;
    }

    const confirmed = window.confirm(
      `Restock ${restockQuantity} units of "${product.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            product_id: productId,
            type: "STOCK_IN",
            quantity: restockQuantity,
            price: Number(product.price),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to restock product"
        );
      }

      // Update product immediately
      setProducts((currentProducts) =>
        currentProducts.map((item) =>
          item.id === productId
            ? data.product
            : item
        )
      );

      // Refresh transaction table
      fetchTransactions();

      // Recalculate recommendations
      fetchRecommendations();

      alert(
        `${restockQuantity} units of "${product.name}" added successfully.`
      );
    } catch (error) {
      console.error(
        "Restock error:",
        error
      );

      alert(
        error.message ||
          "Failed to restock product."
      );
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div>

      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Here's what's happening with
            your inventory.
          </p>
        </div>
      </div>

      {/* =========================
          STAT CARDS
      ========================= */}

      <div className="stats-grid">

        <StatCard
          title="Total Products"
          value={
            loading
              ? "..."
              : totalProducts
          }
          subtitle="Products in inventory"
          icon={Package}
        />

        <StatCard
          title="Total Stock"
          value={
            loading
              ? "..."
              : totalStock
          }
          subtitle="Total units available"
          icon={Boxes}
        />

        <StatCard
          title="Low Stock"
          value={
            loading
              ? "..."
              : lowStock
          }
          subtitle="Needs attention"
          icon={AlertTriangle}
        />

        <StatCard
          title="Out of Stock"
          value={
            loading
              ? "..."
              : outOfStock
          }
          subtitle="Immediate action required"
          icon={XCircle}
        />

      </div>

      {/* =========================
          ADD PRODUCT
      ========================= */}

      <section className="section">

        <AddProductForm
          onProductAdded={
            handleProductAdded
          }
        />

      </section>

      {/* =========================
          INVENTORY OVERVIEW
      ========================= */}

      <section className="section">

        <div className="section-header">

          <h2>
            Inventory Overview
          </h2>

          <span>
            Current stock
          </span>

        </div>

        {loading ? (
          <p>
            Loading inventory...
          </p>
        ) : products.length === 0 ? (
          <p>
            No products available.
          </p>
        ) : (
          <div className="inventory-chart">

            {products.map(
              (product) => {

                const quantity =
                  Number(
                    product.quantity
                  );

                const percentage =
                  (quantity /
                    maxStock) *
                  100;

                return (
                  <div
                    className="chart-row"
                    key={product.id}
                  >

                    <span>
                      {product.name}
                    </span>

                    <div className="bar">

                      <div
                        className="bar-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                    <strong>
                      {quantity}
                    </strong>

                  </div>
                );
              }
            )}

          </div>
        )}

      </section>

      {/* =========================
          PRODUCT INVENTORY
      ========================= */}

      <section className="section">

        <div className="section-header">

          <h2>
            Product Inventory
          </h2>

          <span>
            {filteredProducts.length}{" "}
            of{" "}
            {products.length} products
          </span>

        </div>

        {/* SEARCH & FILTERS */}

        <div className="inventory-filters">

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
          >

            <option value="ALL">
              All Categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="ALL">
              All Status
            </option>

            <option value="HEALTHY">
              Healthy
            </option>

            <option value="LOW_STOCK">
              Low Stock
            </option>

            <option value="OUT_OF_STOCK">
              Out of Stock
            </option>

          </select>

        </div>

        {/* =========================
            EDIT FORM
        ========================= */}

        {editingProduct && (

          <form
            className="edit-product-form"
            onSubmit={
              handleUpdateProduct
            }
          >

            <h3>
              Edit Product
            </h3>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    editForm.name
                  }
                  onChange={
                    handleEditChange
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={
                    editForm.category
                  }
                  onChange={
                    handleEditChange
                  }
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  name="quantity"
                  value={
                    editForm.quantity
                  }
                  onChange={
                    handleEditChange
                  }
                  min="0"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={
                    editForm.price
                  }
                  onChange={
                    handleEditChange
                  }
                  min="0"
                  required
                />

              </div>

              <div className="form-group">

                <label>
                  Reorder Level
                </label>

                <input
                  type="number"
                  name="reorder_level"
                  value={
                    editForm.reorder_level
                  }
                  onChange={
                    handleEditChange
                  }
                  min="0"
                  required
                />

              </div>

            </div>

            <div className="form-actions">

              <button type="submit">
                Save Changes
              </button>

              <button
                type="button"
                onClick={() =>
                  setEditingProduct(
                    null
                  )
                }
              >
                Cancel
              </button>

            </div>

          </form>

        )}

        {/* =========================
            PRODUCT TABLE
        ========================= */}

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredProducts.length ===
              0 ? (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign:
                        "center",
                    }}
                  >
                    No products found.
                  </td>

                </tr>

              ) : (

                filteredProducts.map(
                  (product) => {

                    const quantity =
                      Number(
                        product.quantity
                      );

                    const reorderLevel =
                      Number(
                        product.reorder_level
                      );

                    let status =
                      "Healthy";

                    if (
                      quantity === 0
                    ) {
                      status =
                        "Out of Stock";
                    } else if (
                      quantity <=
                      reorderLevel
                    ) {
                      status =
                        "Low Stock";
                    }

                    return (

                      <tr
                        key={
                          product.id
                        }
                      >

                        <td>
                          #
                          {
                            product.id
                          }
                        </td>

                        <td>
                          {
                            product.name
                          }
                        </td>

                        <td>
                          {
                            product.category
                          }
                        </td>

                        <td>
                          ₹
                          {Number(
                            product.price
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          {quantity}
                        </td>

                        <td>
                          {
                            reorderLevel
                          }
                        </td>

                        <td>

                          <span
                            className={`status ${status
                              .toLowerCase()
                              .replaceAll(
                                " ",
                                "-"
                              )}`}
                          >
                            {
                              status
                            }
                          </span>

                        </td>

                        <td>

                          <button
                            className="edit-button"
                            onClick={() =>
                              handleEditClick(
                                product
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDeleteProduct(
                                product
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =========================
          SMART RECOMMENDATIONS
      ========================= */}

      <section className="section">

        <div className="section-header">

          <h2>
            Smart Recommendations
          </h2>

          <span>
            {recommendationsLoading
              ? "Analyzing inventory..."
              : `${recommendations.length} recommendation${
                  recommendations.length !==
                  1
                    ? "s"
                    : ""
                }`}
          </span>

        </div>

        <div className="recommendations-grid">

          {recommendationsLoading ? (

            <p>
              Analyzing inventory...
            </p>

          ) : recommendations.length ===
            0 ? (

            <p>
              All products have healthy
              stock levels.
            </p>

          ) : (

            recommendations.map(
              (recommendation) => (

                <RecommendationCard
                  key={
                    recommendation.id
                  }

                  productId={
                    recommendation.id
                  }

                  onRestock={
                    handleRestock
                  }

                  status={
                    recommendation.status
                  }

                  product={
                    recommendation.name
                  }

                  currentStock={
                    recommendation.current_stock
                  }

                  reorderLevel={
                    recommendation.reorder_level
                  }

                  averageDailySales={
                    recommendation.average_daily_sales
                  }

                  estimatedDaysUntilStockout={
                    recommendation.estimated_days_until_stockout
                  }

                  recommendedStock={
                    recommendation.recommended_stock
                  }

                  reorderQuantity={
                    recommendation.reorder_quantity
                  }
                />

              )
            )

          )}

        </div>

      </section>

      {/* =========================
          RECENT TRANSACTIONS
      ========================= */}

      <section className="section">

        <div className="section-header">

          <h2>
            Recent Transactions
          </h2>

          <span>
            {transactionsLoading
              ? "Loading..."
              : `${transactions.length} transaction${
                  transactions.length !==
                  1
                    ? "s"
                    : ""
                }`}
          </span>

        </div>

        {transactionsLoading ? (

          <p>
            Loading transactions...
          </p>

        ) : transactions.length ===
          0 ? (

          <p>
            No transactions yet.
          </p>

        ) : (

          <TransactionTable
            transactions={
              transactions
            }
          />

        )}

      </section>

      {/* =========================
          ANALYTICS
      ========================= */}

      <section className="analytics">

        <Analytics />

      </section>

    </div>
  );
}

export default Dashboard;
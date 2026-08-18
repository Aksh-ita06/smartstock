import { useEffect, useState } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  ArrowDownToLine,
} from "lucide-react";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        return response.json();
      })
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Analytics error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="section">
        <div className="section-header">
          <h2>Analytics</h2>
          <span>Loading...</span>
        </div>

        <p>Loading analytics...</p>
      </section>
    );
  }

  if (!analytics) {
    return (
      <section className="section">
        <div className="section-header">
          <h2>Analytics</h2>
        </div>

        <p>Unable to load analytics.</p>
      </section>
    );
  }

  const {
    summary,
    salesByProduct,
    purchasesByProduct,
    activity,
  } = analytics;

  return (
    <section className="section">

      {/* =========================
          HEADER
      ========================= */}

      <div className="section-header">
        <div>
          <h2>Analytics</h2>
          <span>Inventory performance overview</span>
        </div>
      </div>


      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="analytics-grid">

        {/* TOTAL SALES */}

        <div className="analytics-card">

          <div className="analytics-card-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <p>Total Sales</p>

            <h3>
              ₹
              {Number(
                summary.total_sales
              ).toLocaleString("en-IN")}
            </h3>
          </div>

        </div>


        {/* TOTAL PURCHASES */}

        <div className="analytics-card">

          <div className="analytics-card-icon">
            <ShoppingCart size={22} />
          </div>

          <div>
            <p>Total Purchases</p>

            <h3>
              ₹
              {Number(
                summary.total_purchases
              ).toLocaleString("en-IN")}
            </h3>
          </div>

        </div>


        {/* UNITS SOLD */}

        <div className="analytics-card">

          <div className="analytics-card-icon">
            <ArrowDownToLine size={22} />
          </div>

          <div>
            <p>Units Sold</p>

            <h3>
              {Number(
                summary.units_sold
              ).toLocaleString("en-IN")}
            </h3>
          </div>

        </div>


        {/* UNITS PURCHASED */}

        <div className="analytics-card">

          <div className="analytics-card-icon">
            <Package size={22} />
          </div>

          <div>
            <p>Units Purchased</p>

            <h3>
              {Number(
                summary.units_purchased
              ).toLocaleString("en-IN")}
            </h3>
          </div>

        </div>

      </div>


      {/* =========================
          SALES BY PRODUCT
      ========================= */}

      <div className="analytics-panels">

        <div className="analytics-panel">

          <div className="section-header">
            <h3>Sales by Product</h3>
            <span>Top selling products</span>
          </div>

          {salesByProduct.length === 0 ? (

            <p>No sales recorded yet.</p>

          ) : (

            <div className="analytics-table-container">

              <table>

                <thead>

                  <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Sales Amount</th>
                  </tr>

                </thead>

                <tbody>

                  {salesByProduct.map(
                    (product) => (

                      <tr
                        key={
                          product.product_name
                        }
                      >

                        <td>
                          {product.product_name}
                        </td>

                        <td>
                          {Number(
                            product.units_sold
                          )}
                        </td>

                        <td>
                          ₹
                          {Number(
                            product.sales_amount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* =========================
            PURCHASES BY PRODUCT
        ========================= */}

        <div className="analytics-panel">

          <div className="section-header">
            <h3>Purchases by Product</h3>
            <span>Stock purchased</span>
          </div>

          {purchasesByProduct.length === 0 ? (

            <p>No purchases recorded yet.</p>

          ) : (

            <div className="analytics-table-container">

              <table>

                <thead>

                  <tr>
                    <th>Product</th>
                    <th>Units</th>
                    <th>Purchase Amount</th>
                  </tr>

                </thead>

                <tbody>

                  {purchasesByProduct.map(
                    (product) => (

                      <tr
                        key={
                          product.product_name
                        }
                      >

                        <td>
                          {product.product_name}
                        </td>

                        <td>
                          {Number(
                            product.units_purchased
                          )}
                        </td>

                        <td>
                          ₹
                          {Number(
                            product.purchase_amount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>


      {/* =========================
          TRANSACTION ACTIVITY
      ========================= */}

      <div className="analytics-panel">

        <div className="section-header">

          <h3>Transaction Activity</h3>

          <span>
            Daily inventory movement
          </span>

        </div>


        {activity.length === 0 ? (

          <p>No transaction activity yet.</p>

        ) : (

          <div className="analytics-table-container">

            <table>

              <thead>

                <tr>
                  <th>Date</th>
                  <th>Units Sold</th>
                  <th>Units Purchased</th>
                </tr>

              </thead>

              <tbody>

                {activity.map((day) => (

                  <tr key={day.date}>

                    <td>
                      {new Date(
                        day.date
                      ).toLocaleDateString(
                        "en-IN"
                      )}
                    </td>

                    <td>
                      {Number(
                        day.units_sold
                      )}
                    </td>

                    <td>
                      {Number(
                        day.units_purchased
                      )}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>
  );
}

export default Analytics;
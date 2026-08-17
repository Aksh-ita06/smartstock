import {
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import StatCard from "../components/StatCard";
import RecommendationCard from "../components/RecommendationCard";
import TransactionTable from "../components/TransactionTable";

function Dashboard() {
  const transactions = [
    {
      id: 1,
      product: "Laptop",
      type: "SALE",
      quantity: 5,
      warehouse: "Warehouse B",
      date: "17 Aug 2026",
    },
    {
      id: 2,
      product: "Keyboard",
      type: "PURCHASE",
      quantity: 50,
      warehouse: "Warehouse A",
      date: "17 Aug 2026",
    },
    {
      id: 3,
      product: "Mouse",
      type: "TRANSFER",
      quantity: 20,
      warehouse: "A → B",
      date: "16 Aug 2026",
    },
    {
      id: 4,
      product: "Monitor",
      type: "SALE",
      quantity: 8,
      warehouse: "Warehouse C",
      date: "16 Aug 2026",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Here's what's happening with your inventory.</p>
        </div>
      </div>

      {/* STAT CARDS */}

      <div className="stats-grid">
        <StatCard
          title="Total Products"
          value="248"
          subtitle="+12 this month"
          icon={Package}
        />

        <StatCard
          title="Total Stock"
          value="4,820"
          subtitle="Across 3 warehouses"
          icon={Boxes}
        />

        <StatCard
          title="Low Stock"
          value="17"
          subtitle="Needs attention"
          icon={AlertTriangle}
        />

        <StatCard
          title="Out of Stock"
          value="5"
          subtitle="Immediate action required"
          icon={XCircle}
        />
      </div>

      {/* INVENTORY */}

      <section className="section">
        <div className="section-header">
          <h2>Inventory Overview</h2>
          <span>Current stock</span>
        </div>

        <div className="inventory-chart">
          <div className="chart-row">
            <span>Warehouse A</span>
            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: "90%" }}
              />
            </div>
            <strong>2,340</strong>
          </div>

          <div className="chart-row">
            <span>Warehouse B</span>
            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: "55%" }}
              />
            </div>
            <strong>1,420</strong>
          </div>

          <div className="chart-row">
            <span>Warehouse C</span>
            <div className="bar">
              <div
                className="bar-fill"
                style={{ width: "40%" }}
              />
            </div>
            <strong>1,060</strong>
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS */}

      <section className="section">
        <div className="section-header">
          <h2>Smart Recommendations</h2>
          <span>3 actions recommended</span>
        </div>

        <div className="recommendations-grid">
          <RecommendationCard
            type="LOW_STOCK"
            product="Laptop"
            warehouse="Warehouse B"
            message="Only 3 units remaining. Minimum required stock is 10."
            action="Review Stock"
          />

          <RecommendationCard
            type="REORDER"
            product="Wireless Mouse"
            warehouse="Warehouse C"
            message="Sales increased by 32% this week. Consider ordering 50 units."
            action="Create Purchase"
          />

          <RecommendationCard
            type="TRANSFER"
            product="Keyboard"
            warehouse="Warehouse B"
            message="Warehouse A has excess stock. Transfer 20 units to Warehouse B."
            action="Review Transfer"
          />
        </div>
      </section>

      {/* RECENT TRANSACTIONS */}

      <section className="section">
        <div className="section-header">
          <h2>Recent Transactions</h2>
          <span>Latest activity</span>
        </div>

        <TransactionTable transactions={transactions} />
      </section>
    </div>
  );
}

export default Dashboard;
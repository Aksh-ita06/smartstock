import { useState } from "react";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Warehouses from "./pages/Warehouses";
import Transactions from "./pages/Transactions";

import "./index.css";

function App() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "products":
        return <Products />;

      case "warehouses":
        return <Warehouses />;

      case "transactions":
        return <Transactions />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Navbar page={page} setPage={setPage} />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
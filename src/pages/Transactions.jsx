import { Plus } from "lucide-react";
import TransactionTable from "../components/TransactionTable";

function Transactions() {
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
    {
      id: 5,
      product: "Laptop",
      type: "PURCHASE",
      quantity: 30,
      warehouse: "Warehouse A",
      date: "15 Aug 2026",
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>Track every inventory movement.</p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          New Transaction
        </button>
      </div>

      <div className="filters">
        <select>
          <option>All Transactions</option>
          <option>Purchase</option>
          <option>Sale</option>
          <option>Transfer</option>
        </select>

        <select>
          <option>All Warehouses</option>
          <option>Warehouse A</option>
          <option>Warehouse B</option>
          <option>Warehouse C</option>
        </select>
      </div>

      <TransactionTable transactions={transactions} />
    </div>
  );
}

export default Transactions;
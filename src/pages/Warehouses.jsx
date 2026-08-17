import { MapPin, Package, AlertTriangle, Plus } from "lucide-react";

function Warehouses() {
  const warehouses = [
    {
      id: 1,
      name: "Warehouse A",
      location: "Delhi",
      products: 124,
      units: 2340,
      lowStock: 5,
    },
    {
      id: 2,
      name: "Warehouse B",
      location: "Mumbai",
      products: 98,
      units: 1420,
      lowStock: 8,
    },
    {
      id: 3,
      name: "Warehouse C",
      location: "Bangalore",
      products: 76,
      units: 1060,
      lowStock: 4,
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Warehouses</h1>
          <p>Monitor inventory across locations.</p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Warehouse
        </button>
      </div>

      <div className="warehouse-grid">
        {warehouses.map((warehouse) => (
          <div className="warehouse-card" key={warehouse.id}>
            <div className="warehouse-card-header">
              <div className="warehouse-icon">
                <Package size={22} />
              </div>

              <div>
                <h2>{warehouse.name}</h2>

                <div className="location">
                  <MapPin size={15} />
                  {warehouse.location}
                </div>
              </div>
            </div>

            <div className="warehouse-stats">
              <div>
                <strong>{warehouse.products}</strong>
                <span>Products</span>
              </div>

              <div>
                <strong>
                  {warehouse.units.toLocaleString()}
                </strong>
                <span>Total Units</span>
              </div>
            </div>

            <div className="warehouse-warning">
              <AlertTriangle size={16} />
              {warehouse.lowStock} low-stock products
            </div>

            <button className="secondary-button">
              View Inventory
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Warehouses;
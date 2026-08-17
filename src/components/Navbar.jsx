import {
  LayoutDashboard,
  Package,
  Warehouse,
  ArrowLeftRight,
} from "lucide-react";

function Navbar({ page, setPage }) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
    },
    {
      id: "warehouses",
      label: "Warehouses",
      icon: Warehouse,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: ArrowLeftRight,
    },
  ];

  return (
    <nav className="navbar">
      <div className="logo">
        <div className="logo-icon">S</div>
        <span>SmartStock</span>
      </div>

      <div className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`nav-button ${
                page === item.id ? "active" : ""
              }`}
              onClick={() => setPage(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
import {
  AlertTriangle,
  ShoppingCart,
  ArrowRightLeft,
} from "lucide-react";

function RecommendationCard({
  type,
  product,
  warehouse,
  message,
  action,
}) {
  let Icon;

  if (type === "LOW_STOCK") {
    Icon = AlertTriangle;
  } else if (type === "REORDER") {
    Icon = ShoppingCart;
  } else {
    Icon = ArrowRightLeft;
  }

  return (
    <div className={`recommendation-card ${type.toLowerCase()}`}>
      <div className="recommendation-icon">
        <Icon size={22} />
      </div>

      <div className="recommendation-content">
        <div className="recommendation-header">
          <h3>
            {type === "LOW_STOCK"
              ? "Critical Stock"
              : type === "REORDER"
              ? "Reorder Recommended"
              : "Transfer Recommended"}
          </h3>

          <span className="recommendation-type">
            {warehouse}
          </span>
        </div>

        <strong>{product}</strong>

        <p>{message}</p>

        <button className="action-button">
          {action}
        </button>
      </div>
    </div>
  );
}

export default RecommendationCard;
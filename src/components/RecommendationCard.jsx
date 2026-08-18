import {
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";

function RecommendationCard({
  productId,
  status,
  product,
  currentStock,
  reorderLevel,
  averageDailySales,
  estimatedDaysUntilStockout,
  recommendedStock,
  reorderQuantity,
  onRestock,
}) {
  const isUrgent = status === "URGENT";

  const handleRestockClick = () => {
    if (!reorderQuantity || reorderQuantity <= 0) {
      alert("No restock required for this product.");
      return;
    }

    onRestock(productId, reorderQuantity);
  };

  return (
    <div
      className={`recommendation-card ${
        isUrgent ? "urgent" : "warning"
      }`}
    >

      {/* ICON */}
      <div className="recommendation-icon">
        {isUrgent ? (
          <AlertTriangle size={22} />
        ) : (
          <ShoppingCart size={22} />
        )}
      </div>

      {/* CONTENT */}
      <div className="recommendation-content">

        {/* HEADER */}
        <div className="recommendation-header">

          <h3>
            {isUrgent
              ? "Urgent Reorder"
              : "Reorder Recommended"}
          </h3>

          <span className="recommendation-type">
            {status}
          </span>

        </div>

        {/* PRODUCT */}
        <strong className="recommendation-product">
          {product}
        </strong>

        {/* DETAILS */}
        <div className="recommendation-details">

          <div>
            <span>Current Stock</span>
            <strong>{currentStock}</strong>
          </div>

          <div>
            <span>Reorder Level</span>
            <strong>{reorderLevel}</strong>
          </div>

          <div>
            <span>Daily Sales</span>
            <strong>
              {Number(averageDailySales).toFixed(2)}
            </strong>
          </div>

          <div>
            <span>Stockout In</span>
            <strong>
              {estimatedDaysUntilStockout === null
                ? "N/A"
                : `${Number(
                    estimatedDaysUntilStockout
                  ).toFixed(1)} days`}
            </strong>
          </div>

        </div>

        {/* RECOMMENDATION */}
        <div className="recommendation-summary">

          <p>
            Recommended stock:{" "}
            <strong>
              {recommendedStock} units
            </strong>
          </p>

          <p>
            Suggested reorder:{" "}
            <strong>
              {reorderQuantity} units
            </strong>
          </p>

        </div>

        {/* RESTOCK BUTTON */}
        <button
          type="button"
          className="action-button"
          onClick={handleRestockClick}
        >
          <ShoppingCart size={16} />
          <span>Restock {reorderQuantity} Units</span>
        </button>

      </div>
    </div>
  );
}

export default RecommendationCard;
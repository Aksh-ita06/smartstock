function TransactionTable({ transactions }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{ textAlign: "center" }}
              >
                No transactions yet.
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id}>

                {/* PRODUCT */}
                <td>
                  {transaction.product_name}
                </td>

                {/* TYPE */}
                <td>
                  <span
                    className={`transaction-type ${transaction.type.toLowerCase()}`}
                  >
                    {transaction.type ===
                    "STOCK_IN"
                      ? "Stock In"
                      : "Stock Out"}
                  </span>
                </td>

                {/* QUANTITY */}
                <td>
                  {transaction.quantity}
                </td>

                {/* PRICE */}
                <td>
                  ₹
                  {Number(
                    transaction.price
                  ).toLocaleString("en-IN")}
                </td>

                {/* DATE */}
                <td>
                  {new Date(
                    transaction.created_at
                  ).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
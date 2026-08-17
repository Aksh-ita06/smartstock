function TransactionTable({ transactions }) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Warehouse</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.product}</td>

              <td>
                <span
                  className={`transaction-type ${transaction.type.toLowerCase()}`}
                >
                  {transaction.type}
                </span>
              </td>

              <td>{transaction.quantity}</td>

              <td>{transaction.warehouse}</td>

              <td>{transaction.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
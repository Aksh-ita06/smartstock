require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT NOW()", (err, result) => {
  if (err) {
    console.error("❌ PostgreSQL connection failed:", err);
  } else {
    console.log("✅ PostgreSQL connected:", result.rows[0]);
  }
});

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "SmartStock API is running",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "Hello from Express!",
  });
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Failed to fetch products",
    });
  }
});


app.post("/api/products", async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      price,
      reorder_level,
    } = req.body;

    if (
      !name ||
      !category ||
      quantity === undefined ||
      price === undefined ||
      reorder_level === undefined
    ) {
      return res.status(400).json({
        error: "All product fields are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO products
      (name, category, quantity, price, reorder_level)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        name,
        category,
        quantity,
        price,
        reorder_level,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Failed to create product",
    });
  }
});


app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      quantity,
      price,
      reorder_level,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET
        name = $1,
        category = $2,
        quantity = $3,
        price = $4,
        reorder_level = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
      `,
      [
        name,
        category,
        quantity,
        price,
        reorder_level,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Failed to update product",
    });
  }
});


app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);

    res.status(500).json({
      error: "Failed to delete product",
    });
  }
});


app.post("/api/transactions", async (req, res) => {
  const {
    product_id,
    type,
    quantity,
    price,
  } = req.body;

  // Validate required fields
  if (!product_id || !type || !quantity) {
    return res.status(400).json({
      error:
        "product_id, type and quantity are required",
    });
  }

  // Validate transaction type
  if (
    !["STOCK_IN", "STOCK_OUT"].includes(type)
  ) {
    return res.status(400).json({
      error:
        "Type must be STOCK_IN or STOCK_OUT",
    });
  }

  // Validate quantity
  if (Number(quantity) <= 0) {
    return res.status(400).json({
      error:
        "Quantity must be greater than 0",
    });
  }

  const client = await pool.connect();

  try {
    // Start database transaction
    await client.query("BEGIN");


    const productResult = await client.query(
      `
      SELECT *
      FROM products
      WHERE id = $1
      FOR UPDATE
      `,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Product not found",
      });
    }

    const product = productResult.rows[0];

    const transactionQuantity =
      Number(quantity);

    const currentQuantity =
      Number(product.quantity);

    if (
      type === "STOCK_OUT" &&
      currentQuantity < transactionQuantity
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        error:
          `Not enough stock. Available stock: ${currentQuantity}`,
      });
    }

    let newQuantity;

    if (type === "STOCK_IN") {
      newQuantity =
        currentQuantity +
        transactionQuantity;
    } else {
      newQuantity =
        currentQuantity -
        transactionQuantity;
    }


    const updatedProduct =
      await client.query(
        `
        UPDATE products
        SET
          quantity = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
        [
          newQuantity,
          product_id,
        ]
      );


    const transactionResult =
      await client.query(
        `
        INSERT INTO transactions
        (
          product_id,
          type,
          quantity,
          price
        )
        VALUES
        ($1, $2, $3, $4)
        RETURNING *
        `,
        [
          product_id,
          type,
          transactionQuantity,
          price !== undefined &&
          price !== ""
            ? Number(price)
            : null,
        ]
      );


    await client.query("COMMIT");


    res.status(201).json({
      message:
        "Transaction created successfully",

      transaction:
        transactionResult.rows[0],

      product:
        updatedProduct.rows[0],
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(
      "Transaction error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to create transaction",
    });

  } finally {

    client.release();

  }
});


app.get("/api/transactions", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        t.id,
        t.product_id,
        p.name AS product_name,
        t.type,
        t.quantity,
        t.price,
        t.created_at

      FROM transactions t

      JOIN products p
        ON t.product_id = p.id

      ORDER BY t.created_at DESC
    `);

    res.json(result.rows);

  } catch (error) {

    console.error(
      "Transaction fetch error:",
      error
    );

    res.status(500).json({
      error:
        "Failed to fetch transactions",
    });
  }
});

// ANALYTICS

app.get("/api/analytics", async (req, res) => {
  try {
    // Overall sales and purchases
    const summaryResult = await pool.query(`
      SELECT
        COALESCE(SUM(
          CASE
            WHEN type = 'STOCK_OUT'
            THEN quantity * price
            ELSE 0
          END
        ), 0) AS total_sales,

        COALESCE(SUM(
          CASE
            WHEN type = 'STOCK_IN'
            THEN quantity * price
            ELSE 0
          END
        ), 0) AS total_purchases,

        COALESCE(SUM(
          CASE
            WHEN type = 'STOCK_OUT'
            THEN quantity
            ELSE 0
          END
        ), 0) AS units_sold,

        COALESCE(SUM(
          CASE
            WHEN type = 'STOCK_IN'
            THEN quantity
            ELSE 0
          END
        ), 0) AS units_purchased

      FROM transactions
    `);

    // Sales by product
    const salesByProductResult = await pool.query(`
      SELECT
        p.name AS product_name,
        SUM(t.quantity) AS units_sold,
        SUM(t.quantity * t.price) AS sales_amount
      FROM transactions t
      JOIN products p
        ON t.product_id = p.id
      WHERE t.type = 'STOCK_OUT'
      GROUP BY p.name
      ORDER BY units_sold DESC
    `);

    // Purchases by product
    const purchasesByProductResult = await pool.query(`
      SELECT
        p.name AS product_name,
        SUM(t.quantity) AS units_purchased,
        SUM(t.quantity * t.price) AS purchase_amount
      FROM transactions t
      JOIN products p
        ON t.product_id = p.id
      WHERE t.type = 'STOCK_IN'
      GROUP BY p.name
      ORDER BY units_purchased DESC
    `);

    // Transaction activity by date
    const activityResult = await pool.query(`
      SELECT
        DATE(created_at) AS date,

        SUM(
          CASE
            WHEN type = 'STOCK_OUT'
            THEN quantity
            ELSE 0
          END
        ) AS units_sold,

        SUM(
          CASE
            WHEN type = 'STOCK_IN'
            THEN quantity
            ELSE 0
          END
        ) AS units_purchased

      FROM transactions
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({
      summary: summaryResult.rows[0],
      salesByProduct: salesByProductResult.rows,
      purchasesByProduct: purchasesByProductResult.rows,
      activity: activityResult.rows,
    });

  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      error: "Failed to fetch analytics",
    });
  }
});

app.get("/api/forecast", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.quantity AS current_stock,
        p.reorder_level,

        COALESCE(
          SUM(
            CASE
              WHEN t.type = 'STOCK_OUT'
              AND t.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
              THEN t.quantity
              ELSE 0
            END
          ),
          0
        ) AS units_sold,

        COUNT(
          DISTINCT DATE(t.created_at)
        ) FILTER (
          WHERE
            t.type = 'STOCK_OUT'
            AND t.created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
        ) AS sales_days

      FROM products p

      LEFT JOIN transactions t
        ON p.id = t.product_id

      GROUP BY
        p.id,
        p.name,
        p.quantity,
        p.reorder_level

      ORDER BY p.id;
    `);

    const forecast = result.rows.map((product) => {

      const currentStock =
        Number(product.current_stock);

      const unitsSold =
        Number(product.units_sold);

      const salesDays =
        Number(product.sales_days);

      // If there are sales, calculate demand.
      // Otherwise assume zero demand.
      const averageDailySales =
        salesDays > 0
          ? unitsSold / salesDays
          : 0;

      // Estimate how many days current stock will last.
      const estimatedDaysUntilStockout =
        averageDailySales > 0
          ? currentStock / averageDailySales
          : null;

      // Recommended stock target:
      // 30 days of expected demand.
      const recommendedStock =
        Math.ceil(
          averageDailySales * 30
        );

      const reorderQuantity =
        Math.max(
          recommendedStock - currentStock,
          0
        );

      let status = "HEALTHY";

      if (currentStock === 0) {
        status = "OUT_OF_STOCK";
      } else if (
        estimatedDaysUntilStockout !== null &&
        estimatedDaysUntilStockout <= 7
      ) {
        status = "URGENT";
      } else if (
        currentStock <=
        Number(product.reorder_level)
      ) {
        status = "REORDER";
      } else if (
        estimatedDaysUntilStockout !== null &&
        estimatedDaysUntilStockout <= 14
      ) {
        status = "WARNING";
      }

      return {
        id: product.id,
        name: product.name,

        current_stock: currentStock,

        reorder_level:
          Number(product.reorder_level),

        units_sold: unitsSold,

        sales_days: salesDays,

        average_daily_sales:
          Number(
            averageDailySales.toFixed(2)
          ),

        estimated_days_until_stockout:
          estimatedDaysUntilStockout === null
            ? null
            : Number(
                estimatedDaysUntilStockout.toFixed(1)
              ),

        recommended_stock:
          recommendedStock,

        reorder_quantity:
          reorderQuantity,

        status,
      };
    });

    res.json(forecast);

  } catch (error) {

    console.error(
      "Forecast error:",
      error
    );

    res.status(500).json({
      error: "Failed to generate forecast",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
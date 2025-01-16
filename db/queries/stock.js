const pool = require("../pool");

async function getStockLevels() {
  try {
    const result = await pool.query("select * from stock");
    return result.rows;
  } catch (err) {
    console.error("Error querying database: ", err);
    throw err;
  }
}

async function getStockById(id) {
  try {
    const result = await pool.query("select * from stock where stockid = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return { error: "Stock info not found", status: 404 };
    }

    return result.rows[0];
  } catch (err) {
    console.err("Error fetching stock by Id:", err);
    return { err: "An error occurred while fetching the stock", status: 500 };
  }
}

async function addStockEntry({ stockid, partid, quantity }) {
  if (!stockid || !partid || !quantity) {
    throw new Error("Invalid input: All fields must be provided");
  }

  const query =
    "insert into stock (stockid, partid, quantity) values ($1, $2, $3) returning stockid";
  const values = [stockid, partid, quantity];

  try {
    const result = await pool.query(query, values);
    return {
      message: "Stock added successfully",
      partId: result.rows[0].partId,
      status: 201,
    };
  } catch (err) {
    console.error("Could not insert stock:", err);
    throw new Error("Database error: Could not insert stock");
  }
}

async function updateStock({ stockid, partid, quantity }) {
  if (!stockid) {
    throw new Error("stockid is required to update stock");
  }

  const query =
    "update parts set partid = $1, quantity = $2 where stockid = $3 returning *;";
  const values = [partid, quantity, stockid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Could not update stock:", err);
    throw new Error("Database error: Could not update stock");
  }
}

async function deleteStock({ stockid }) {
  const query = "delete from stock where stock = $1";
  const values = [stockid];
  try {
    const result = await pool.query(query, values);
    return {
      message: "Stock deleted successfully",
      stockId: result.rows[0].stockid,
      status: 201,
    };
  } catch (err) {
    console.error("Could not delete stock:", err);
    throw new Error("Database error: Could not delete stock");
  }
}

module.exports = {
  getStockLevels,
  getStockById,
  addStockEntry,
  updateStock,
  deleteStock,
};

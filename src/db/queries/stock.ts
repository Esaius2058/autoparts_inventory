import pool from "../pool";

interface Stock {
  stockid: number;
  partid?: number;
  quantity: number;
  error: string;
  status: number;
}

interface StockResponse {
  stockId: number;
  message: string;
  status: number;
  partId?: number;
}

export async function getStockLevels(): Promise<Stock[]> {
  try {
    const result = await pool.query("select * from stock");
    return result.rows;
  } catch (err: unknown) {
    console.error("Error querying database: ", err);
    throw err;
  }
}

export async function handleGetStockById(id: number): Promise<Stock> {
  try {
    const result = await pool.query("select * from stock where stockid = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Stock info not found");
    }

    return result.rows[0];
  } catch (err: unknown) {
    console.error("Error fetching stock by Id:", err);
    throw new Error("An error occurred while fetching the stock");
  }
}

export async function handleAddStockEntry(
  stockid: number,
  partid: number,
  quantity: number
): Promise<StockResponse> {
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
      stockId: result.rows[0].stockid,
      status: 201,
    };
  } catch (err) {
    console.error("Could not insert stock:", err);
    throw new Error("Database error: Could not insert stock");
  }
}

export async function handleUpdateStock(
  stockid: number,
  partid: number,
  quantity: number
): Promise<Stock | null> {
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

export async function handleDeleteStock(
  stockid: number
): Promise<StockResponse> {
  const query = "delete from stock where stockid = $1";
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

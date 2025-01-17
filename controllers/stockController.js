const db = require("../db/queries/stock");

async function getStockInfo(req, res) {
  try {
    const stock = await db.getStockLevels();
    console.log("Stock info: ", stock);
    return res.status(200).json(stock);
  } catch (err) {
    console.error("Error retreiving stock info: ", err);
    return res
      .status(500)
      .json({ error: "Error retreiving stock info" });
  }
}

async function getStockById(req, res) {
  const { id } = req.params;

  try {
    const result = await db.getStockById(id);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error in controller:", err);
    return res
      .status(500)
      .json({
        error:
          "An unexpected error occured while fetching the stock info",
      });
  }
}

async function addStockInfo(req, res) {
  const { stockid, partid, quantity } = req.body;

  if (!stockid || !partid || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.addStockEntry({ stockid, partid, quantity });
    return res
      .status(201)
      .json({ message: "Stock info added successfully", data: result });
  } catch (err) {
    console.error("Error while adding the stock info", err);
    return res.status(500).json({ error: "Error, could not add stock info" });
  }
}

async function updateStock(req, res) {
  const { stockid, partid, quantity } = req.body;

  if (!stockid) {
    return res
      .status(400)
      .json({ error: "Error fetching the stockid" });
  }

  try {
    const result = await db.updateStock({ stockid, partid, quantity });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error while updating the stock info", err);
    return res
      .status(500)
      .json({ error: "Error, could not update stock info" });
  }
}

async function deleteStock(req, res) {
  const { stockid } = req.params;

  if (!stockid || isNaN(Number(stockid))) {
    return res
      .status(400)
      .json({ error: "Error fetching the stockid" });
  }

  try {
    const result = await db.deleteStock({
      stockid: Number(stockid),
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error while deleting the stockid", err);
    return res.status(500).json({ error: "Error, internal server error" });
  }
}

module.exports = {
  getStockInfo,
  getStockById,
  addStockInfo,
  updateStock,
  deleteStock
};

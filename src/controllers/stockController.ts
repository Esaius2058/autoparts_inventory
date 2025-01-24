import { Request, Response } from "express";
import {
  getStockLevels,
  handleGetStockById,
  handleAddStockEntry,
  handleUpdateStock,
  handleDeleteStock,
} from "../db/queries/stock";

export async function getStockInfo(req: Request, res: Response): Promise<void> {
  try {
    const stock = await getStockLevels();
    res.status(200).json(stock);
  } catch (err) {
    console.error("Error retreiving stock info: ", err);
    res.status(500).json({ error: "Error retreiving stock info" });
  }
}

export async function getStockById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await handleGetStockById(Number(id));

    if (result.error) {
      res.status(result.status).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error in controller:", err);
    res.status(500).json({
      error: "An unexpected error occured while fetching the stock info",
    });
  }
}

export async function addStockInfo(req: Request, res: Response): Promise<void> {
  const { stockid, partid, quantity } = req.body;

  if (!stockid || !partid || !quantity) {
    res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await handleAddStockEntry(stockid, partid, quantity);
    res
      .status(201)
      .json({ message: "Stock info added successfully", data: result });
  } catch (err) {
    console.error("Error while adding the stock info", err);
    res.status(500).json({ error: "Error, could not add stock info" });
  }
}

export async function updateStock(req: Request, res: Response): Promise<void> {
  const { stockid, partid, quantity } = req.body;

  if (!stockid) {
    res.status(400).json({ error: "Error fetching the stockid" });
  }

  try {
    const result = await handleUpdateStock(stockid, partid, quantity);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error while updating the stock info", err);
    res.status(500).json({ error: "Error, could not update stock info" });
  }
}

export async function deleteStock(req: Request, res: Response): Promise<void> {
  const { stockid } = req.params;

  if (!stockid || isNaN(Number(stockid))) {
    res.status(400).json({ error: "Error fetching the stockid" });
  }

  try {
    const result = await handleDeleteStock(Number(stockid));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error while deleting the stockid", err);
    res.status(500).json({ error: "Error, internal server error" });
  }
}

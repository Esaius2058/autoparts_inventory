import { Request, Response, NextFunction } from "express";
import pool from "../db/pool";
import {
  getAllParts,
  handleAddPart,
  handleDeletePart,
  handleGetPartById,
  handleUpdatePart,
} from "../db/queries/parts";

export async function testdBConnection(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Connected to the database!",
      time: result.rows[0].now,
    });
  } catch (err: any) {
    console.error("Database connection error: ", err);
    res.status(500).json({
      error: "Database connection error",
      details: err.message,
    });
  }
}

export async function getParts(req: Request, res: Response): Promise<void> {
  try {
    const parts = await getAllParts();
    console.log("Parts: ", parts);
    res.status(200).json(parts);
  } catch (err: any) {
    console.error("Error retreiving parts: ", err);
    res.status(500).json({ error: "Error retreiving parts" });
  }
}

export async function getPart(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await handleGetPartById(Number(id));

    if (result.error) {
      res.status(result.status).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Unexpected error in controller:", err);
    res
      .status(500)
      .json({ error: "An unexpected error occured while fetching the part" });
  }
}

export const searchPart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const searchQuery = req.query.search;

  try {
    let parts;
    if (searchQuery) {
      const searchPattern = `%${searchQuery}%`;
      const result = await pool.query(
        `select * from parts where partname ILIKE $1`,
        [searchPattern]
      );
      parts = result.rows;
    } else {
      const result = await pool.query("select * from parts");
      parts = result.rows;
    }

    res.render("index", { title: "Parts List", parts });
  } catch (error: any) {
    next(error);
  }
};

export async function addPart(req: Request, res: Response): Promise<void> {
  const { partname, description, price, categoryid } = req.body;

  if (!partname || !description || !price || !categoryid) {
    res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await handleAddPart(
      partname,
      description,
      price,
      categoryid
    );
    res.status(201).json({ message: "Part added successfully", data: result });
  } catch (err: any) {
    console.error("Error while adding the part", err);
    res.status(500).json({ error: "Error, could not add part" });
  }
}

export async function updatePart(req: Request, res: Response): Promise<void> {
  const { partid, partname, description, price, categoryid } = req.body;

  if (!partid) {
    res.status(400).json({ error: "Error fetching the partid" });
  }

  try {
    const result = await handleUpdatePart(
      partid,
      partname,
      description,
      price,
      categoryid
    );

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Error while updating the part", err);
    res.status(500).json({ error: "Error, could not update part" });
  }
}

export async function deletePart(req: Request, res: Response): Promise<void> {
  const { partid } = req.params;

  if (!partid || isNaN(Number(partid))) {
    res.status(400).json({ error: "Error fetching the partid" });
  }

  try {
    const result = await handleDeletePart(Number(partid));

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Error while deleting the part", err);
    res.status(500).json({ error: "Error, internal server error" });
  }
}

import { Request, Response } from "express";
import {
  getAllCompRecords,
  handleAddCompatibility,
  handleDeleteCompInfo,
  handleGetCompatibilityById,
  handleUpdateCompatibility,
} from "../db/queries/compatibility";

export async function getCompInfo(req: Request, res: Response): Promise<void> {
  try {
    const compatibility = await getAllCompRecords();
    console.log("Compatibility info: ", compatibility);
    res.status(200).json(compatibility);
  } catch (err: any) {
    console.error("Error retreiving compatibility info: ", err);
    res.status(500).json({ error: "Error retreiving compatibility info" });
  }
}

export async function getCompById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await handleGetCompatibilityById(Number(id));

    if (result.error) {
      res.status(result.status).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Unexpected error in controller:", err);
    res
      .status(500)
      .json({
        error:
          "An unexpected error occured while fetching the compatibility info",
      });
  }
}

export async function addCompInfo(req: Request, res: Response): Promise<void> {
  const { compatibilityid, make, partid } = req.body;

  if (!compatibilityid || !make || !partid) {
    res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await handleAddCompatibility(compatibilityid, make, partid);
    res
      .status(201)
      .json({ message: "Compatibility info added successfully", data: result });
  } catch (err: any) {
    console.error("Error while adding the comp info", err);
    res.status(500).json({ error: "Error, could not add comp info" });
  }
}

export async function updateCompInfo(
  req: Request,
  res: Response
): Promise<void> {
  const { compatibilityid, make, partid } = req.body;

  if (!compatibilityid) {
    res.status(400).json({ error: "Error fetching the compatibilityid" });
  }

  try {
    const result = await handleUpdateCompatibility(
      compatibilityid,
      make,
      partid
    );

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Error while updating the comp info", err);
    res.status(500).json({ error: "Error, could not update compability info" });
  }
}

export async function deleteCompInfo(
  req: Request,
  res: Response
): Promise<void> {
  const { compatibilityid } = req.params;

  if (!compatibilityid || isNaN(Number(compatibilityid))) {
    res.status(400).json({ error: "Error fetching the compatibilityid" });
  }

  try {
    const result = await handleDeleteCompInfo(Number(compatibilityid));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error while deleting the compatibilityid", err);
    res.status(500).json({ error: "Error, internal server error" });
  }
}

import { Request, Response } from "express";
import {
  getAllSuppliers,
  handleAddSupplier,
  handleDeleteSupplier,
  handleGetSupplierById,
  handleUpdateSupplier,
} from "../db/queries/supplier";

export async function getSuppliers(req: Request, res: Response): Promise<void> {
  try {
    const suppliers = await getAllSuppliers();
    console.log("Suppliers: ", suppliers);
    res.status(200).json(suppliers);
  } catch (err: any) {
    console.error("Error retreiving suppliers: ", err);
    res.status(500).json({ error: "Error retreiving suppliers" });
  }
}

export async function getSupplierById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const result = await handleGetSupplierById(Number(id));

    if (result.error) {
      res.status(result.status).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Unexpected error in controller:", err);
    res.status(500).json({
      error: "An unexpected error occured while fetching the supplier",
    });
  }
}

export async function addSupplier(req: Request, res: Response): Promise<void> {
  const { supplierid, suppliername, contactinfo } = req.body;

  if (
    !supplierid ||
    !suppliername ||
    !contactinfo ||
    typeof contactinfo !== "string"
  ) {
    res
      .status(400)
      .json({
        error:
          "Invalid or missing required fields: supplierid, suppliername, or contactinfo",
      });
  }

  try {
    const result = await handleAddSupplier(
      supplierid,
      suppliername,
      contactinfo
    );
    res
      .status(201)
      .json({ message: "Supplier added successfully", data: result });
  } catch (err: any) {
    console.error("Error while adding the supplier", err);
    res.status(500).json({ error: "Error, could not add supplier" });
  }
}

export async function updateSupplier(
  req: Request,
  res: Response
): Promise<void> {
  const { supplierid, suppliername, contactinfo } = req.body;

  if (!supplierid) {
    res.status(400).json({ error: "Error fetching the supplierid" });
  }

  try {
    const result = await handleUpdateSupplier(
      supplierid,
      suppliername,
      contactinfo
    );

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Error while updating the supplier", err);
    res.status(500).json({ error: "Error, could not update supplier" });
  }
}

export async function deleteSupplier(
  req: Request,
  res: Response
): Promise<void> {
  const { supplierid } = req.params;

  if (!supplierid || isNaN(Number(supplierid))) {
    res.status(400).json({ error: "Missing or invalid supplierid" });
  }

  try {
    const result = await handleDeleteSupplier(Number(supplierid));

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Error while deleting the supplier", err);
    res.status(500).json({ error: "Error, internal server error" });
  }
}

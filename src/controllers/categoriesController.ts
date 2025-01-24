import { Request, Response, NextFunction } from "express";
import {
  getAllCategories,
  getCategoryById,
  handleAddCategory,
  handleUpdateCategory,
  handleDeleteCategory,
} from "../db/queries/categories";

export async function getCategories(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const categories = await getAllCategories();
    console.log("Categories: ", categories);
    res.status(200).json(categories);
  } catch (err: any) {
    console.error("Error retreiving categories: ", err);
    res.status(500).json({ error: "Error retreiving categories" });
  }
}

export async function getCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await getCategoryById(Number(id));

    if (result.error) {
      res.status(result.status).json({ error: result.error });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error in controller:", err);
    res.status(500).json({
      error: "An unexpected error occured while fetching the category",
    });
  }
}

export async function addCategory(req: Request, res: Response): Promise<void> {
  const { categoryid, categoryname } = req.body;

  if (!categoryname || !categoryid) {
    res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await handleAddCategory(categoryid, categoryname);
    res
      .status(201)
      .json({ message: "Category added successfully", data: result });
  } catch (err) {
    console.error("Error while adding the category", err);
    res.status(500).json({ error: "Error, could not add category" });
  }
}

export async function updateCategory(
  req: Request,
  res: Response
): Promise<void> {
  const { categoryid, categoryname } = req.body;

  if (!categoryid) {
    res.status(400).json({ error: "Error fetching the categoryid" });
  }

  try {
    const result = await handleUpdateCategory(categoryid, categoryname);

    res.status(200).json(result);
  } catch (err) {
    console.error("Error while updating the category", err);
    res.status(500).json({ error: "Error, could not update category" });
  }
}

export async function deleteCategory(
  req: Request,
  res: Response
): Promise<void> {
  const { id: categoryid } = req.params;

  if (!categoryid || isNaN(Number(categoryid))) {
    res.status(400).json({ error: "Error fetching the categoryid" });
  }

  try {
    const result = await handleDeleteCategory(Number(categoryid));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error while deleting the category", err);
    res.status(500).json({ error: "Error, internal server error" });
  }
}

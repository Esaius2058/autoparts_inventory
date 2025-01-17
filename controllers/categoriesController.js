const db = require("../db/queries/categories");

async function getCategories(req, res) {
  try {
    const categories = await db.getAllCategories();
    console.log("Categories: ", categories);
    return res.status(200).json(categories);
  } catch (err) {
    console.error("Error retreiving categories: ", err);
    return res.status(500).json({ error: "Error retreiving categories" });
  }
}

async function getCategory(req, res) {
  const { id } = req.params;

  try {
    const result = await db.getCategoryById(id);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error in controller:", err);
    return res
      .status(500)
      .json({ error: "An unexpected error occured while fetching the category" });
  }
}

async function addCategory(req, res) {
  const { categoryid, categoryname } = req.body;

  if (!categoryname || !categoryid) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.addCategory({categoryid, categoryname});
    return res
      .status(201)
      .json({ message: "Category added successfully", data: result });
  } catch (err) {
    console.error("Error while adding the category", err);
    return res.status(500).json({ error: "Error, could not add category" });
  }
}

async function updateCategory(req, res) {
  const {categoryid, categoryname} = req.body;

  if (!categoryid) {
    return res.status(400).json({ error: "Error fetching the categoryid" });
  }

  try {
    const result = db.updateCategory({categoryid, categoryname});

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error while updating the category", err);
    return res.status(500).json({ error: "Error, could not update category" });
  }
}

async function deleteCategory(req, res) {
  const { categoryid } = req.params;

  if (!categoryid || isNaN(Number(categoryid))) {
    return res.status(400).json({ error: "Error fetching the categoryid" });
  }

  try {
    const result = await db.deleteCategory({ categoryid: Number(categoryid) });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error while deleting the category", err);
    return res.status(500).json({ error: "Error, internal server error" });
  }
}

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};

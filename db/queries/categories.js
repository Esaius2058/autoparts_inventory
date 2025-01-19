const pool = require("../pool");

async function getAllCategories() {
  try {
    const result = await pool.query("select * from categories");
    return result.rows;
  } catch (err) {
    console.error("Error querying database: ", err);
    throw err;
  }
}

async function getCategoryById(id) {
  try {
    const result = await pool.query("select * from categories where categoryid = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return { error: "Category not found", status: 404 };
    }

    return result.rows[0];
  } catch (err) {
    console.err("Error fetching category by Id:", err);
    return { err: "An error occurred while fetching the part", status: 500 };
  }
}

async function addCategory({ categoryid, categoryname }) {
  if (!categoryid || !categoryname) {
    throw new Error("Invalid input: All fields must be provided");
  }

  const query =
    "insert into categories (categoryid, categoryname) values ($1, $2) returning categoryid";
  const values = [categoryid, categoryname];

  try {
    const result = await pool.query(query, values);
    return {
      message: "Category added successfully",
      categoryId: result.rows[0].categoryid,
      status: 201,
    };
  } catch (err) {
    console.error("Could not insert category:", err);
    throw new Error("Database error: Could not insert category");
  }
}

async function updateCategory({categoryid, categoryname}) {
  if (!categoryid) {
    throw new Error("categoryid is required to update a category");
  }

  const query =
    "update categories set categoryname = $1 where categoryid = $2 returning *;";
  const values = [categoryname, categoryid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Could not update category:", err);
    throw new Error("Database error: Could not update category");
  }
}

async function deleteCategory({ categoryid }) {
  const query = `alter table parts 
    drop constraint parts_categoryid_fkey;
    
    alter table parts
    add constaint parts_categoryid_fkey
    foreign key (categoryid)
    references categories(categoryid)
    on delete cascade;
    `;
  const values = [categoryid];
  try {
    const result = await pool.query(query, values);
    return {
      message: "Category added successfully",
      categoryId: result.rows[0].categoryid,
      status: 201,
    };
  } catch (err) {
    console.error("Could not delete category:", err);
    throw new Error("Database error: Could not delete category");
  }
}

module.exports = {
	getAllCategories,
	getCategoryById,
	addCategory,
	updateCategory,
	deleteCategory
}
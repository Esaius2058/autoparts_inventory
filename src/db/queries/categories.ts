import pool from "../pool";

interface Category {
  categoryid: string;
  categoryname: string;
  error: string;
  status: number;
}

interface CategoryResponse {
  message: string;
  categoryId: number;
  status: number;
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const result = await pool.query("select * from categories");
    return result.rows;
  } catch (err: unknown) {
    console.error("Error querying database: ", err);
    throw err;
  }
}

export async function getCategoryById(id: number): Promise<Category> {
  try {
    const result = await pool.query("select * from categories where categoryid = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Category not found");
    }

    return result.rows[0];
  } catch (err: unknown) {
    console.error("Error fetching category by Id:", err);
    throw new Error("An error occurred while fetching the part");
  }
}

export async function handleAddCategory(categoryid: number, categoryname: string): Promise<CategoryResponse> {
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
  } catch (err: unknown) {
    console.error("Could not insert category:", err);
    throw new Error("Database error: Could not insert category");
  }
}

export async function handleUpdateCategory(categoryid: number, categoryname: string): Promise<Category | null> {
  if (!categoryid) {
    throw new Error("categoryid is required to update a category");
  }

  const query =
    "update categories set categoryname = $1 where categoryid = $2 returning *;";
  const values = [categoryname, categoryid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err: unknown) {
    console.error("Could not update category:", err);
    throw new Error("Database error: Could not update category");
  }
}

export async function handleDeleteCategory(categoryid: number): Promise<CategoryResponse> {
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
  } catch (err: unknown) {
    console.error("Could not delete category:", err);
    throw new Error("Database error: Could not delete category");
  }
}

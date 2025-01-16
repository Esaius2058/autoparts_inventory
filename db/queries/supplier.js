const pool = require("../pool");

async function getAllSuppliers() {
  try {
    const result = await pool.query("select * from suppliers");
    return result.rows;
  } catch (err) {
    console.error("Error querying database: ", err);
    throw err;
  }
}

async function getSupplierById(id) {
  try {
    const result = await pool.query("select * from suppliers where supplierid = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return { error: "Supplier not found", status: 404 };
    }

    return result.rows[0];
  } catch (err) {
    console.err("Error fetching supplier by Id:", err);
    return { err: "An error occurred while fetching the supplier", status: 500 };
  }
}

async function addSupplier({ supplierid, suppliername, contactinfo }) {
  if (!supplierid || !suppliername || !contactinfo) {
    throw new Error("Invalid input: All fields must be provided");
  }

  const query =
    "insert into suppliers (supplierid, suppliername, contactinfo) values ($1, $2, $3) returning supplierid";
  const values = [supplierid, suppliername, contactinfo];

  try {
    const result = await pool.query(query, values);
    return {
      message: "Supplier added successfully",
      partId: result.rows[0].partId,
      status: 201,
    };
  } catch (err) {
    console.error("Could not insert supplier:", err);
    throw new Error("Database error: Could not insert supplier");
  }
}

async function updateSupplier({ supplierid, suppliername, contactinfo }) {
  if (!supplierid) {
    throw new Error("supplierid is required to update supplier");
  }

  const query =
    "update suppliers set suppliername = $1, contactinfo = $2 where supplierid = $3 returning *;";
  const values = [suppliername, contactinfo, supplierid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Could not update supplier:", err);
    throw new Error("Database error: Could not update supplier");
  }
}

async function deleteSupplier({ supplierid }) {
  const query = "delete from supplier where supplierid = $1";
  const values = [supplierid];
  try {
    const result = await pool.query(query, values);
    return {
      message: "Supplier deleted successfully",
      supplierId: result.rows[0].supplierid,
      status: 201,
    };
  } catch (err) {
    console.error("Could not delete supplier:", err);
    throw new Error("Database error: Could not delete supplier");
  }
}

module.exports = {
  getAllSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier
};

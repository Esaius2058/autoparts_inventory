const pool = require("../pool");

async function getAllCompRecords() {
  try {
    const result = await pool.query("select * from compatibility");
    return result.rows;
  } catch (err) {
    console.error("Error querying database: ", err);
    throw err;
  }
}

async function getCompatibilityById(id) {
  try {
    const result = await pool.query("select * from compatibility where compatibilityid = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return { error: "Compatibility record not found", status: 404 };
    }

    return result.rows[0];
  } catch (err) {
    console.err("Error fetching compatibility record by id:", err);
    return { err: "An error occurred while fetching the compatibility record", status: 500 };
  }
}

async function addCompatibility({ compatibilityid, make, partid }) {
  if (!compatibilityid || !make || !partid) {
    throw new Error("Invalid input: All fields must be provided");
  }

  const query =
    "insert into compatibility (compatibilityid, make, partid) values ($1, $2, $3) returning compatibilityid";
  const values = [compatibilityid, make, partid];

  try {
    const result = await pool.query(query, values);
    return {
      message: "Compatibility information added successfully",
      compatibilityId: result.rows[0].compatibilityid,
      status: 201,
    };
  } catch (err) {
    console.error("Could not insert compatibility:", err);
    throw new Error("Database error: Could not insert compatibility");
  }
}

async function updateCompatibility({compatibilityid, make, partid}) {
  if (!partId) {
    throw new Error("compatibilityid is required to update compatibility info");
  }

  const query = "update compatibility set make= $1, partid = $2 where compatibilityid = $3 returning *;";
  const values = [compatibilityid, make, partid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Could not update compatibility information:", err);
    throw new Error("Database error: Could not update compatibility information");
  }
}

async function deleteCompInfo({ compatibilityid }) {
  const query = "delete from compatibility where compatibilityid = $1";
  const values = [compatibilityid];
  try {
    const result = await pool.query(query, values);
    return {
      message: "Compatibility info deleted successfully",
      compatibilityId: result.rows[0].compatibilityid,
      status: 201,
    };
  } catch (err) {
    console.error("Could not delete compatibility info:", err);
    throw new Error("Database error: Could not delete compatibility info");
  }
}

module.exports = {
	getAllCompRecords,
	getCompatibilityById,
	addCompatibility,
	updateCompatibility,
	deleteCompInfo
}
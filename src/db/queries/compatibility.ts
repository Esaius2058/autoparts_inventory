import pool from "../pool";

interface Compatibility {
  compatibilityid: number;
  make: string;
  partid?: string;
  error: string;
  status: number;
}

interface CompatibilityResponse {
  message: string;
  status: number;
  compatibilityId: number;
}

export async function getAllCompRecords(): Promise<Compatibility[]> {
  try {
    const result = await pool.query("select * from compatibility");
    return result.rows;
  } catch (err: unknown) {
    console.error("Error querying database: ", err);
    throw err;
  }
}

export async function handleGetCompatibilityById(
  id: number
): Promise<Compatibility> {
  try {
    const result = await pool.query(
      "select * from compatibility where compatibilityid = $1",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Compatibility record not found");
    }

    return result.rows[0];
  } catch (err: unknown) {
    console.error("Error fetching compatibility record by id:", err);
    throw new Error(
      "An error occurred while fetching the compatibility record"
    );
  }
}

export async function handleAddCompatibility(
  compatibilityid: number,
  make: string,
  partid: number
): Promise<Compatibility | CompatibilityResponse> {
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

export async function handleUpdateCompatibility(
  compatibilityid: number,
  make: string,
  partid: number
): Promise<Compatibility | null> {
  if (!compatibilityid) {
    throw new Error("compatibilityid is required to update compatibility info");
  }

  const query =
    "update compatibility set make= $1, partid = $2 where compatibilityid = $3 returning *;";
  const values = [make, partid, compatibilityid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Could not update compatibility information:", err);
    throw new Error(
      "Database error: Could not update compatibility information"
    );
  }
}

export async function handleDeleteCompInfo(
  compatibilityid: number
): Promise<CompatibilityResponse> {
  const query = "delete from compatibility where compatibilityid = $1";
  const values = [compatibilityid];

  try {
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return {
        message: "Compatibility record not found",
        compatibilityId: compatibilityid,
        status: 404,
      };
    }

    return {
      message: "Compatibility info deleted successfully",
      compatibilityId: result.rows[0].compatibilityid,
      status: 201,
    };
  } catch (err: unknown) {
    console.error("Could not delete compatibility info:", err);
    throw new Error("Database error: Could not delete compatibility info");
  }
}

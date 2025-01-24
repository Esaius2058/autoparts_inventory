import pool from "../pool";

interface Part {
  partid?: number;
  partname: string;
  description: string;
  price: number;
  categoryid: number;
  error: string;
  status: number;
}

interface PartResponse {
  message: string;
  partId?: number;
  status: number;
}

export async function getAllParts(): Promise<Part[]> {
  try {
    const result = await pool.query("select * from parts");
    return result.rows;
  } catch (err: unknown) {
    console.error("Error querying database: ", err);
    throw err;
  }
}

export async function handleGetPartById(id: number): Promise<Part> {
  try {
    const result = await pool.query("select * from parts where partid = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      throw new Error("Part not found");
    }

    return result.rows[0];
  } catch (err: unknown) {
    console.error("Error fetching part by Id:", err);
    throw new Error("An error occurred while fetching the part");
  }
}

export async function handleAddPart(
  partname: string,
  description: string,
  price: number,
  categoryid: number
): Promise<PartResponse> {
  if (!partname || !description || price == null || !categoryid) {
    throw new Error("Invalid input: All fields must be provided");
  }

  const query =
    "insert into parts (partname, description, price, categoryid) values ($1, $2, $3, $4) returning partid";
  const values = [partname, description, price, categoryid];

  try {
    const result = await pool.query(query, values);
    return {
      message: "Part added successfully",
      partId: result.rows[0].partid,
      status: 201,
    };
  } catch (err: unknown) {
    console.error("Could not insert part:", err);
    throw new Error("Database error: Could not insert part");
  }
}

export async function handleUpdatePart(
  partid: string,
  partname: string,
  description: string,
  price: number,
  categoryid: number
): Promise<Part | null> {
  if (!partid) {
    throw new Error("partid is required to update a part");
  }

  const query =
    "update parts set partname = $1, description = $2, price = $3, categoryid = $4 where partid = $5 returning *;";
  const values = [partname, description, price, categoryid, partid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err: any) {
    console.error("Could not update part:", err);
    throw new Error("Database error: Could not update part");
  }
}

export async function handleDeletePart(partid: number): Promise<PartResponse> {
  const query = "delete from parts where partid = $1 returning partid";
  const values = [partid];
  try {
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return {
        message: "Part not found",
        status: 404,
      };
    }

    return {
      message: "Part deleted successfully",
      partId: result.rows[0].partid,
      status: 200,
    };
  } catch (err: unknown) {
    console.error("Could not delete part:", err);
    throw new Error(`Database error: Could not delete part`);
  }
}

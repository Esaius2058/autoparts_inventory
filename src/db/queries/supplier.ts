import { Interface } from "readline";
import pool from "../pool";

interface Supplier {
  supplierid: number;
  suppliername: string;
  contactinfo: string;
  error: string;
  status: number;
}

interface SupplierResponse {
  message: string;
  supplierId?: number;
  status: number;
}

export async function getAllSuppliers(): Promise<Supplier[]> {
  try {
    const result = await pool.query("select * from suppliers");
    return result.rows;
  } catch (err: any) {
    console.error("Error querying database: ", err);
    throw err;
  }
}

export async function handleGetSupplierById(id: number): Promise<Supplier> {
  try {
    const result = await pool.query(
      "select * from suppliers where supplierid = $1",
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error("Supplier not found");
    }

    return result.rows[0];
  } catch (err: any) {
    console.error("Error fetching supplier by Id:", err);
    throw new Error("An error occurred while fetching the supplier");
  }
}

export async function handleAddSupplier(
  supplierid: number,
  suppliername: string,
  contactinfo: string
): Promise<SupplierResponse> {
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
      supplierId: result.rows[0].supplierid,
      status: 201,
    };
  } catch (err: any) {
    console.error("Could not insert supplier:", err);
    throw new Error("Database error: Could not insert supplier");
  }
}

export async function handleUpdateSupplier(
  supplierid: number,
  suppliername: string,
  contactinfo: string
): Promise<Supplier | null> {
  if (!supplierid) {
    throw new Error("supplierid is required to update supplier");
  }

  const query =
    "update suppliers set suppliername = $1, contactinfo = $2 where supplierid = $3 returning *;";
  const values = [suppliername, contactinfo, supplierid];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err: any) {
    console.error("Could not update supplier:", err);
    throw new Error("Database error: Could not update supplier");
  }
}

export async function handleDeleteSupplier(
  supplierid: number
): Promise<SupplierResponse> {
  const query = "delete from suppliers where supplierid = $1";
  const values = [supplierid];
  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      throw new Error("Supplier not found");
    }

    return {
      message: "Supplier deleted successfully",
      supplierId: result.rows[0].supplierid,
      status: 201,
    };
  } catch (err: any) {
    console.error("Could not delete supplier:", err);
    throw new Error("Database error: Could not delete supplier");
  }
}

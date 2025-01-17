const db = require("../db/queries/supplier");

async function getSuppliers(req, res) {
  try {
    const suppliers = await db.getAllSuppliers();
    console.log("Suppliers: ", suppliers);
    return res.status(200).json(suppliers);
  } catch (err) {
    console.error("Error retreiving suppliers: ", err);
    return res
      .status(500)
      .json({ error: "Error retreiving suppliers" });
  }
}

async function getSupplierById(req, res) {
  const { id } = req.params;

  try {
    const result = await db.getSupplierById(id);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error in controller:", err);
    return res
      .status(500)
      .json({
        error:
          "An unexpected error occured while fetching the supplier",
      });
  }
}

async function addSupplier(req, res) {
  const { supplierid, suppliername, contactinfo } = req.body;

  if (!supplierid || !suppliername || !contactinfo || typeof contactinfo !== "string") {
    return res.status(400).json({ error: "Invalid or missing required fields: supplierid, suppliername, or contactinfo" });
  }

  try {
    const result = await db.addSupplier({ supplierid, suppliername, contactinfo });
    return res
      .status(201)
      .json({ message: "Supplier added successfully", data: result });
  } catch (err) {
    console.error("Error while adding the supplier", err);
    return res.status(500).json({ error: "Error, could not add supplier" });
  }
}

async function updateSupplier(req, res) {
  const { supplierid, suppliername, contactinfo } = req.body;

  if (!supplierid) {
    return res
      .status(400)
      .json({ error: "Error fetching the supplierid" });
  }

  try {
    const result = await db.updateSupplier({ supplierid, suppliername, contactinfo });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error while updating the supplier", err);
    return res
      .status(500)
      .json({ error: "Error, could not update supplier" });
  }
}

async function deleteSupplier(req, res) {
  const { supplierid } = req.params;

  if (!supplierid || isNaN(Number(supplierid))) {
    return res
      .status(400)
      .json({ error: "Missing or invalid supplierid" });
  }

  try {
    const result = await db.deleteSupplier({
      supplierid: Number(supplierid),
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error while deleting the supplier", err);
    return res.status(500).json({ error: "Error, internal server error" });
  }
}

module.exports = {
  getSuppliers,
  getSupplierById,
  addSupplier,
  updateSupplier,
  deleteSupplier
};

const db = require("../db/queries/compatibility");

async function getCompInfo(req, res) {
  try {
    const compatibility = await db.getAllCompRecords();
    console.log("Compatibility info: ", compatibility);
    return res.status(200).json(compatibility);
  } catch (err) {
    console.error("Error retreiving compatibility info: ", err);
    return res
      .status(500)
      .json({ error: "Error retreiving compatibility info" });
  }
}

async function getCompById(req, res) {
  const { id } = req.params;

  try {
    const result = await db.getCompatibilityById(id);

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
          "An unexpected error occured while fetching the compatibility info",
      });
  }
}

async function addCompInfo(req, res) {
  const { compatibilityid, make, partid } = req.body;

  if (!compatibilityid || !make || !partid) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.addCategory({ compatibilityid, make, partid });
    return res
      .status(201)
      .json({ message: "Compatibility info added successfully", data: result });
  } catch (err) {
    console.error("Error while adding the comp info", err);
    return res.status(500).json({ error: "Error, could not add comp info" });
  }
}

async function updateCompInfo(req, res) {
  const { compatibilityid, make, partid } = req.body;

  if (!compatibilityid) {
    return res
      .status(400)
      .json({ error: "Error fetching the compatibilityid" });
  }

  try {
    const result = db.updatePart({ compatibilityid, make, partid });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error while updating the comp info", err);
    return res
      .status(500)
      .json({ error: "Error, could not update compability info" });
  }
}

async function deleteCompInfo(req, res) {
  const { compatibilityid } = req.params;

  if (!compatibilityid || isNaN(Number(compatibilityid))) {
    return res
      .status(400)
      .json({ error: "Error fetching the compatibilityid" });
  }

  try {
    const result = await db.deletePart({
      compatibilityid: Number(compatibilityid),
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error while deleting the compatibilityid", err);
    return res.status(500).json({ error: "Error, internal server error" });
  }
}

module.exports = {
  getCompInfo,
  getCompById,
  addCompInfo,
  updateCompInfo,
  deleteCompInfo
};

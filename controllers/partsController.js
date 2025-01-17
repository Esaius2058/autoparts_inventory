const db = require("../db/queries/parts");

async function getParts(req, res) {
  try {
    const parts = await db.getAllParts();
    console.log("Parts: ", parts);
    return res.status(200).json(parts);
  } catch (err) {
    console.error("Error retreiving parts: ", err);
    return res.status(500).json({ error: "Error retreiving parts" });
  }
}

async function getPart(req, res) {
  const { id } = req.params;

  try {
    const result = await db.getPartById(id);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Unexpected error in controller:", err);
    return res
      .status(500)
      .json({ error: "An unexpected error occured while fetching the part" });
  }
}

async function addPart(req, res) {
  const { partname, description, price, categoryid } = req.body;

  if (!partname || !description || !price || !categoryid) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await db.addPart({
      partname,
      description,
      price,
      categoryid,
    });
    return res
      .status(201)
      .json({ message: "Part added successfully", data: result });
  } catch (err) {
    console.error("Error while adding the part", err);
    return res.status(500).json({ error: "Error, could not add part" });
  }
}

async function updatePart(req, res) {
  const { partid, partname, description, price, categoryid } = req.body;

	if(!partid){
		return res.status(400).json({error: "Error fetching the partid"});
	}

	try{
		const result = await db.updatePart({ partid, partname, description, price, categoryid });

		return res.status(200).json(result);
	}catch(err){
		console.error("Error while updating the part", err);
    return res.status(500).json({ error: "Error, could not update part" });
	}
}

async function deletePart(req, res){
	const { partid } = req.params;
 
	if(!partid || isNaN(Number(partid))){
		return res.status(400).json({error: "Error fetching the partid"});
	}

	try{
		const result = await db.deletePart({partid: Number(partid)});

		return res.status(200).json(result);
	}catch(err){
		console.error("Error while deleting the part", err);
    return res.status(500).json({ error: "Error, internal server error" });
	}
}

module.exports = {
  getParts,
  getPart,
  addPart,
	updatePart,
	deletePart
};

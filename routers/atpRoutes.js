const {Router} = require("express");
const atpRouter = Router();
const partsController = require("../controllers/partsController");
const stockController = require("../controllers/stockController");
const categoriesController = require("../controllers/categoriesController");
const compatibilityController = require("../controllers/compatibilityController");
const suppliersController = require("../controllers/suppliersController");

// Test database connection
atpRouter.get("/test-db", partsController.testdBConnection);

// Parts
atpRouter.get("/", partsController.getParts); //Retrieve all parts
atpRouter.get("/parts/:id", partsController.getPart); //Retrieve a specific part by ID
atpRouter.post("/parts/new", partsController.addPart); //Add a new part
atpRouter.put("/parts/:id", partsController.updatePart); //Update an existing part
atpRouter.delete("/parts/:id", partsController.deletePart); //Delete a specific part
atpRouter.get("/parts/search", partsController.searchPart); //Search parts by name, category, or condition

//Categories
atpRouter.get("/categories", categoriesController.getCategories);
atpRouter.get("/categories/:id", categoriesController.getCategory);
atpRouter.post("/categories/new", categoriesController.addCategory);
atpRouter.put("/categories/:id", categoriesController.updateCategory);
atpRouter.delete("/categories/:id", categoriesController.deleteCategory);

//Compatibility
atpRouter.get("/compatibility", compatibilityController.getCompInfo);
atpRouter.get("/compatibility/:id", compatibilityController.getCompById);
atpRouter.post("/compatibility/new", compatibilityController.addCompInfo);
atpRouter.put("/compatibility/:id", compatibilityController.updateCompInfo);
atpRouter.delete("/compatibility/:id",compatibilityController.deleteCompInfo);

//Stock
atpRouter.get("/stock", stockController.getStockInfo);
atpRouter.get("/stock/:id", stockController.getStockById);
atpRouter.post("/stock/new", stockController.addStockInfo);
atpRouter.put("/stock/:id", stockController.updateStock);
atpRouter.delete("/stock/:id", stockController.deleteStock);

//Suppliers
atpRouter.get("/suppliers", suppliersController.getSuppliers);
atpRouter.get("/suppliers/:id", suppliersController.getSupplierById);
atpRouter.post("/supplier/new", suppliersController.addSupplier);
atpRouter.put("/suppliers/:id", suppliersController.updateSupplier);
atpRouter.delete("/suppliers/:id", suppliersController.deleteSupplier);

module.exports = atpRouter;
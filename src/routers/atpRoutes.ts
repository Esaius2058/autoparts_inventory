import {Router} from "express";
import {getPart, getParts, addPart, updatePart ,deletePart, searchPart, testdBConnection} from "../controllers/partsController";
import {getStockInfo, getStockById, addStockInfo, updateStock, deleteStock} from "../controllers/stockController";
import {getCategories, getCategory, addCategory, updateCategory, deleteCategory} from "../controllers/categoriesController";
import {getCompInfo, getCompById, addCompInfo, updateCompInfo, deleteCompInfo} from "../controllers/compatibilityController";
import {getSuppliers, getSupplierById, addSupplier, updateSupplier, deleteSupplier} from "../controllers/suppliersController";

const atpRouter: Router = Router();
// Test database connection
atpRouter.get("/test-db", testdBConnection);

// Parts
atpRouter.get("/", getParts); //Retrieve all parts
atpRouter.get("/parts/:id", getPart); //Retrieve a specific part by ID
atpRouter.post("/parts/new", addPart); //Add a new part
atpRouter.put("/parts/:id", updatePart); //Update an existing part
atpRouter.delete("/parts/:id", deletePart); //Delete a specific part
atpRouter.get("/parts/search", searchPart); //Search parts by name, category, or condition

//Categories
atpRouter.get("/categories", getCategories);
atpRouter.get("/categories/:id", getCategory);
atpRouter.post("/categories/new", addCategory);
atpRouter.put("/categories/:id", updateCategory);
atpRouter.delete("/categories/:id", deleteCategory);

//Compatibility
atpRouter.get("/compatibility", getCompInfo);
atpRouter.get("/compatibility/:id", getCompById);
atpRouter.post("/compatibility/new", addCompInfo);
atpRouter.put("/compatibility/:id", updateCompInfo);
atpRouter.delete("/compatibility/:id",deleteCompInfo);

//Stock
atpRouter.get("/stock", getStockInfo);
atpRouter.get("/stock/:id", getStockById);
atpRouter.post("/stock/new", addStockInfo);
atpRouter.put("/stock/:id", updateStock);
atpRouter.delete("/stock/:id", deleteStock);

//Suppliers
atpRouter.get("/suppliers", getSuppliers);
atpRouter.get("/suppliers/:id", getSupplierById);
atpRouter.post("/supplier/new", addSupplier);
atpRouter.put("/suppliers/:id", updateSupplier);
atpRouter.delete("/suppliers/:id", deleteSupplier);

export default atpRouter;
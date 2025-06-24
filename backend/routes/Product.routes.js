import { Router } from "express";
import { createProduct, getCategoryProduct, getProducts, getUserProduct, getArchivedProducts, changeProductData } from "../controllers/Product.controller.js";
import { isLogged } from "../middleware/islogged.js";

const router = Router();

router.post("/createProduct", isLogged, createProduct);
router.get("/products", getProducts);
router.get("/userProducts", getUserProduct);
router.get("/categoryProducts", getCategoryProduct);
router.post("/archivedProducts", isLogged, getArchivedProducts);
router.put("/chengeProductData", isLogged, changeProductData)

export default router;

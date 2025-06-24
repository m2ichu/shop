import { Router } from "express";

import { getAllNotAprovedProducts, getAllNotAprovedSubCategories, acceptProduct, approveSubCategory, editSubCategory, deleteSubCategory, deleteProduct } from "../controllers/Admin.controller.js";
import { isLogged } from "../middleware/islogged.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.post("/getAllNotAprovedProducts", isLogged, isAdmin,  getAllNotAprovedProducts);
router.post("/getAllNotAprovedSubCategories", isLogged, isAdmin, getAllNotAprovedSubCategories);
router.put("/acceptProduct", isLogged, isAdmin, acceptProduct);
router.put("/approveSubCategory", isLogged, isAdmin, approveSubCategory);
router.put("/editSubCategory", isLogged, isAdmin, editSubCategory);
router.delete("/deleteSubCategory", isLogged, isAdmin, deleteSubCategory);
router.delete("/deleteProduct", isLogged, isAdmin, deleteProduct);

export default router;
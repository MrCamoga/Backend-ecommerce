const express = require("express");
const router = express.Router();

const CatController = require("../controllers/CategoryController");

const { authentication, isAdmin } = require("../middleware/authentication");

router.get("/", CatController.getCategoriesAndProducts); // Query param: name
router.get("/:id", CatController.getCategoryById);
router.post("/", authentication, isAdmin, CatController.createCategory);
router.put("/:id", authentication, isAdmin, CatController.updateCategory);
router.delete("/:id", authentication, isAdmin, CatController.deleteCategory);

module.exports = router;

const express = require("express");
const router = express.Router();

const { getAll, getById, create, updateById, deleteById } = require("../controllers/ProductController");
const { authentication } = require("../middleware/authentication");


router.get("/", getAll); // Query params: price, minPrice, maxPrice, name, sort{ASC|DESC}
router.get("/:id", getById);
router.post("/", authentication, create);
router.put("/:id", authentication, updateById);
router.delete("/:id", authentication, deleteById);

module.exports = router;

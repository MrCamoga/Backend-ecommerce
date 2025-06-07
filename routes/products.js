const express = require("express");
const router = express.Router();

const { getAll, getById, create, updateById, deleteById } = require("../controllers/ProductController");
const { authentication, isAdmin } = require("../middleware/authentication");
const { getProductReviews } = require("../controllers/ReviewController");

router.get("/", getAll); // Query params: price, minPrice, maxPrice, name, sort{ASC|DESC}
router.get("/:id/reviews", getProductReviews);
router.get("/:id", getById);
router.post("/", authentication, isAdmin, create);
router.put("/:id", authentication, isAdmin, updateById);
router.delete("/:id", authentication, isAdmin, deleteById);

module.exports = router;

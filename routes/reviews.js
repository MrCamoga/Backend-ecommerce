const express = require("express");
const router = express.Router();

const { getReviewById, createReview, updateReview, deleteReview } = require("../controllers/ReviewController");
const { authentication } = require("../middleware/authentication");


//router.get("/", getAll);
router.get("/:id", getReviewById);
router.post("/", authentication, createReview);
router.put("/:id", authentication, updateReview);
router.delete("/:id", authentication, deleteReview);

module.exports = router;


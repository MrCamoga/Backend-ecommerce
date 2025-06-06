const express = require("express");
const router = express.Router();

const { createOrder, getOrders } = require("../controllers/OrderController");

const { authentication } = require("../middleware/authentication");

router.get("/", getOrders);
router.post("/", authentication, createOrder);

module.exports = router;

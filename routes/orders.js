const express = require("express");
const router = express.Router();

const { createOrder, getOrders } = require("../controllers/OrderController");

const { authentication, isAdmin } = require("../middleware/authentication");

router.get("/", authentication, isAdmin, getOrders);
router.post("/", authentication, createOrder);

module.exports = router;

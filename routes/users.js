const express = require("express");
const router = express.Router();

const { signUp, getOrders } = require("../controllers/UserController");

router.get("/orders", getOrders);
//router.get("/:id", getById);
router.post("/", signUp);

module.exports = router;

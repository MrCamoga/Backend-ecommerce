const express = require("express");
const router = express.Router();

const { signUp, getOrders } = require("../controllers/UserController");

const { authentication } = require("../middleware/authentication");

// TODO add :id parameter
router.get("/orders", authentication, getOrders);
//router.get("/:id", getById);
router.post("/", signUp);

module.exports = router;

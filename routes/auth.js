const express = require("express");
const router = express.Router();

const { login, logout, confirm } = require("../controllers/AuthController");

router.post("/login", login);
router.delete("/logout", logout);
router.get("/confirm/:token", confirm);

module.exports = router;

const express = require("express");
const router = express.Router();

const debtController = require("../controllers/debt.controller");
const { validateCreateDebt } = require("../middlewares/debt.middleware");

router.post("/", validateCreateDebt, debtController.create);
router.get("/user/:userId", debtController.listByUser);
router.patch("/:id/pay", debtController.pay);

module.exports = router;
